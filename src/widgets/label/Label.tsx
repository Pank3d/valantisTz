

const Label = ({ value, onChange, text}) => {
  return (
    <label>
      {text}
      <input type='number' value={value} onChange={onChange} />
    </label>
  );
}

export default Label