import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://devsabbir.pro.bd";

type SeoProps = {
  path: string;
  defaultTitle: string;
  defaultDescription?: string;
  defaultImage?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, any>;
};

type Row = { title: string | null; description: string | null; og_image_url: string | null };

export default function Seo({ path, defaultTitle, defaultDescription, defaultImage, type = "website", jsonLd }: SeoProps) {
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("title,description,og_image_url")
        .eq("path", path)
        .maybeSingle();
      if (active) setRow((data as Row) ?? null);
    })();
    return () => { active = false; };
  }, [path]);

  const title = row?.title || defaultTitle;
  const description = row?.description || defaultDescription || "";
  const image = row?.og_image_url || defaultImage || `${SITE_URL}/og-image.jpg`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}