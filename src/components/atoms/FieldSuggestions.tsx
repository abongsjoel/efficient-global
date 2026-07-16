type FieldSuggestionsProps = {
  id: string;
  values: string[];
};

const FieldSuggestions = ({ id, values }: FieldSuggestionsProps) => (
  <datalist id={id}>
    {values.map((value) => (
      <option key={value} value={value} />
    ))}
  </datalist>
);

export default FieldSuggestions;
