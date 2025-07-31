const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-rgb(var(--card)) border border-rgb(var(--border)) rounded-xl shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
