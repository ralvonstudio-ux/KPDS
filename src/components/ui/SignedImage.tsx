import { useEffect, useState } from "react";
import { getSignedCustomerFileUrl } from "@/lib/storage";

/** Renders a private customer-uploads file by resolving a short-lived signed URL first. */
export function SignedImage({ path, alt, className }: { path: string; alt: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getSignedCustomerFileUrl(path).then((signed) => {
      if (isMounted) setUrl(signed);
    });
    return () => {
      isMounted = false;
    };
  }, [path]);

  if (!url) return <div className={`animate-pulse bg-black/5 ${className ?? ""}`} />;
  return <img src={url} alt={alt} className={className} />;
}
