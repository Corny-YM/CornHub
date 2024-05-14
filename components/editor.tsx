import EditorBuild from "ckeditor5-custom-build";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useCallback } from "react";

interface Props {
  data: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

const Editor = ({ data, placeholder, onChange }: Props) => {
  const handleReady = useCallback((e: any) => {
    // console.log(e);
  }, []);
  const handleChange = useCallback((e: any, editor: EditorBuild) => {
    const data = editor.getData();
    onChange?.(data);
  }, []);

  return (
    <div className="flex items-center flex-shrink flex-grow">
      <CKEditor
        editor={EditorBuild}
        config={{ placeholder, removePlugins: ["Heading"] }}
        data={data}
        onReady={handleReady}
        onChange={handleChange}
      />
    </div>
  );
};

export default Editor;
