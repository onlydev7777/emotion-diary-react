import "./Button.css"

const Button = ({text, type, onCLick}) => {
  return (
      <button onClick={onCLick}
              className={`Button Button_${type}`}>
        {text}
      </button>
  );
};

export default Button;