import { Spinner } from "reactstrap";

export default function MySpinner({
  text,
  size,
}: {
  text?: string;
  size?: "sm" | "lg";
}) {
  return (
    <div>
      {text}
      <Spinner
        size={size || "sm"}
        style={{
          marginLeft: "10px",
          verticalAlign: "middle",
        }}
      />
    </div>
  );
}
