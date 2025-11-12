import logo from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const Logo = ({ size = "md", animated = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-24 w-auto",
  };

  return (
    <div className={`${animated ? "hover:scale-110 transition-transform duration-300" : ""}`}>
      <img
        src={logo}
        alt="VN TICKET"
        className={`${sizeClasses[size]} drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]`}
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
};

export default Logo;
