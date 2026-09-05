import { useLocation, Link } from "react-router-dom";

function formatPrice(price: number): string {
  if (price >= 1e7) {
    return `₹ ${(price / 1e7).toFixed(2)} Cr`;
  }
  if (price >= 1e5) {
    return `₹ ${(price / 1e5).toFixed(2)} Lac`;
  }
  return `₹ ${price.toLocaleString("en-IN")}`;
}

const centeredPageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  textAlign: "center",
};

export default function ResultPage() {
  const location = useLocation();
  const predictedPrice = location.state?.predictedPrice as number | undefined;

  if (predictedPrice === undefined) {
    return (
      <div style={centeredPageStyle}>
        <h1>No prediction found</h1>
        <p>Please fill out the form first to get a prediction.</p>
        <Link to="/">Back to form</Link>
      </div>
    );
  }

  return (
    <div style={centeredPageStyle}>
      <h1>Predicted Price</h1>
      <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
        {formatPrice(predictedPrice)}
      </p>
      <Link to="/">Make another prediction</Link>
    </div>
  );
}