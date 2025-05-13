import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { PatternFormat, NumberFormatValues } from "react-number-format";
import Button from "./Button";
import Input from "./Input";
import IconAction from "./IconAction";
import { DotLoader } from "react-spinners";

interface FieldProps {
  label: string;
  name: string;
  type: string;
  isFormatted?: boolean;
  format?: string;
}

interface FormProps {
  formFields: FieldProps[];
  formList: any;
  setFormList: (value: any) => void;
  isEditing: boolean;
  isLoading?: boolean;
  setIsEditing: (value: boolean) => void;
  navigate: (path: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deletarDados?: () => void;
  handleLogout?: () => void;
  iconStyle: string;
  baseText: string;
  labelStyle?: React.CSSProperties;
  title?: string;
  extraContentBottom?: React.ReactNode;
}

const FormComponent: React.FC<FormProps> = ({
  formFields,
  formList,
  setFormList,
  isEditing,
  isLoading = false,
  setIsEditing,
  navigate,
  onSubmit,
  deletarDados,
  handleLogout,
  iconStyle,
  baseText,
  labelStyle,
  title = "Título",
  extraContentBottom,
}) => {
  if (isLoading) {
    return (
      <section className="m-auto flex h-96 w-2/3 items-center justify-center rounded-md bg-white shadow">
        <DotLoader color="var(--color-brown-normal" />
      </section>
    );
  }
  return (
    <section className="m-auto flex w-2/3 flex-col justify-center rounded-md bg-white p-5 shadow">
      <div className="flex w-full items-center justify-between">
        <IconAction onClick={() => navigate("/")}>Voltar</IconAction>

        <div id="icones-de-acao" className="flex justify-end gap-4">
          <div
            id="Editar"
            className={iconStyle}
            onClick={() => setIsEditing(!isEditing)}
          >
            <FiEdit2 className="icon" />
          </div>
          {deletarDados && (
            <div id="deletar" className={iconStyle} onClick={deletarDados}>
              <AiOutlineDelete className="icon" />
            </div>
          )}
        </div>
      </div>

      <h3 className="text-center font-bold">{title}</h3>

      <form onSubmit={onSubmit} className="mt-5 ml-4 flex flex-col gap-4">
        {formFields.map(({ label, name, type, isFormatted, format }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className={baseText} style={labelStyle}>
              {label}
            </label>
            {isEditing ? (
              isFormatted ? (
                <PatternFormat
                  format={format!}
                  mask="_"
                  value={formList[name]}
                  onValueChange={(values: NumberFormatValues) =>
                    setFormList((prev: any) => ({
                      ...prev,
                      [name]: values.value,
                    }))
                  }
                  className="input !w-45"
                  id={name}
                />
              ) : (
                <Input
                  type={type}
                  id={name}
                  name={name}
                  value={formList[name]}
                  onChange={(value) =>
                    setFormList({ ...formList, [name]: value })
                  }
                />
              )
            ) : isFormatted ? (
              <PatternFormat
                value={formList[name]}
                displayType="text"
                format={format!}
                className="font-semibold"
              />
            ) : (
              <span className="font-semibold">{formList[name]}</span>
            )}
          </div>
        ))}
        {isEditing && extraContentBottom}
        {isEditing && (
          <Button type="submit" className="mt-5">
            Salvar
          </Button>
        )}
      </form>

      <hr className="text-gray-light my-4 rounded-xl border-2" />

      {handleLogout && (
        <div className="text-right">
          <Button
            color="outlined"
            className="mt-3 w-55 p-2"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      )}
    </section>
  );
};

export default FormComponent;
