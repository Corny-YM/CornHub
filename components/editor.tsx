import EditorBuild from "ckeditor5-custom-build";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useCallback } from "react";

interface Props {
  data: string;
  placeholder?: string;
}

const Editor = ({ data, placeholder }: Props) => {
  const onReady = useCallback((e: any) => {
    // console.log(e);
  }, []);
  const onChange = useCallback((e: any, editor: EditorBuild) => {
    // const data = editor.getData();
  }, []);

  return (
    <div className="flex items-center w-full">
      <CKEditor
        editor={EditorBuild}
        config={{ placeholder }}
        data={data}
        onReady={onReady}
        onChange={onChange}
      />
    </div>
  );
};

export default Editor;
