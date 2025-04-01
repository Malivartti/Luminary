import aiStore from '@entities/ai';
import envPageStore from '@pages/EnvPage/store';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Delta, Range } from 'quill';
import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

import cls from './Editor.module.scss';
import Tooltip from './Tooltip';


type Props = {
  className?: string;
}

const Editor: FC<Props> = observer(({ className }) => {
  const quillRef = useRef(null);
  const reactQuillRef = useRef<null | ReactQuill>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const reactQuillContaienrRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (reactQuillRef.current !== null) {
      quillRef.current = reactQuillRef.current.getEditor();
    }
  }, []);

  useEffect(() => {
    reactQuillContaienrRef.current = document.querySelector('.ql-container');
  }, []);

  useEffect(() => {
    if (!envPageStore.isOpenFile) return;
    if (!quillRef.current) return;
    
    const delta = new Delta();

    envPageStore.sheet.split('\n').forEach((line: string) => {
      delta.insert(line);
      delta.insert('\n');
    });

    quillRef.current.setContents(delta);
    envPageStore.setIsOpenFile(false);
    
  }, [envPageStore.isOpenFile]);

  useEffect(() => {
    const handleClick = (e: Event) => {
      const mouseEvent = e as unknown as MouseEvent;

      if (tooltipRef.current && tooltipRef.current.contains(mouseEvent.target as Node)) {
        return;
      }
      if (reactQuillContaienrRef.current && !reactQuillContaienrRef.current.contains(mouseEvent.target as Node)) {
        return;
      }
      const selected = quillRef.current.getSelection();
      envPageStore.setSelectedText(quillRef.current.getText(selected));
      envPageStore.setSelectedTextRange(selected );
      setCoords({ x: mouseEvent.clientX, y: mouseEvent.clientY + 25 });
      envPageStore.setIsShowTooltip(true);
    };

    document?.addEventListener('mouseup', handleClick);
    // document.querySelector('.ql-editor')?.addEventListener('mouseup', handleClick);

    return () => {
      document?.removeEventListener('mouseup', handleClick);
      // document.querySelector('.ql-editor').removeEventListener('mouseup', handleClick);
    };
  }, []);


  const onChangeSelection = (range: Range) => {
    if (!range?.length) return;
  };

  const handleSave = () => {
    envPageStore.saveFile();
  };

  const handlePaste = () => {
    quillRef.current.deleteText(envPageStore.selectedTextRange);
    quillRef.current.insertText(envPageStore.selectedTextRange.index, envPageStore.tooltipResponse);
    envPageStore.setTooltipResponse('');
    handleSave();
  };

  useEffect(() => {
    if (!envPageStore.envId) return; 
    aiStore.getContext(envPageStore.envId);
  }, [envPageStore.tooltipResponse]);


  const modules = { 
    history: {
      delay: 1000,
      maxStack: 500,
    },
    toolbar: '#toolbar',
  };


  return (
    <div className={className}>
      <div ref={tooltipRef}>
        <Tooltip
          isShow={envPageStore.isShowTooltip}
          setIsShow={envPageStore.setIsShowTooltip}
          x={coords.x}
          y={coords.y}
          handlePaste={handlePaste}
        />
      </div>
      
      <div id="toolbar">

        <select className="ql-size">
          <option value="small"></option>
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>

        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>


        <button className="ql-link" value="sub"></button>

        <button className="ql-list" value="ordered" type="button"></button>
        <button className="ql-list" value="bullet" type="button"></button>

        <button className={cls.Editor__custom} onClick={handleSave}>Сохранить</button>
        <button
          className={classNames(cls.Editor__custom, { [cls.Editor__enable]: envPageStore.enableTooltip })}
          onClick={envPageStore.toggleEnableTooltip}
        >
          AI
        </button>
      </div>
      <ReactQuill
        ref={reactQuillRef}
        className={cls.Editor}
        theme="snow"
        onChange={() => envPageStore.setSheet(quillRef.current.getText())}
        modules={modules} 
        onChangeSelection={onChangeSelection}
      />
    </div>
  );
});

export default Editor;
