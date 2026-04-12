import Link from "next/link";

const PolicyConfidentialityLinkComponent = () => {
  return (
    <div className="flex max-w-sm flex-wrap justify-center mt-auto mb-6 gap-1 text-xs text-chart-4">
      Si vous continuez vous acceptez notre
      <Link className="underline hover:text-foreground" href={"/"}>
        politique de confidentialité
      </Link>
      et
      <Link className="underline hover:text-foreground" href={"/"}>
        conditions générales d’utilisation
      </Link>
    </div>
  );
};

export default PolicyConfidentialityLinkComponent;
