
const Input = ({value, onChange}) => {
  return (
    <input
      className="w-100 border "
      type="text"
      value={value}
      onChange={onChange}
    />
  );
}

export default Input