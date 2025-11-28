/** Additional meta that complements generateMetadata in layout.tsx. */
export default function Head() {
  return (
    <>
      <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: light)" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AstrBot" />

      <meta name="msapplication-TileColor" content="#0a0a0a" />

      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <meta
        name="keywords"
        content="AstrBot,AI,机器人,chatbot,LLM,大模型,多平台,QQ机器人,Telegram Bot,Discord Bot,开源"
      />
      <meta name="author" content="IGCrystal" />

      <meta property="og:type" content="website" />
      <meta property="og:image" content="/AstrBot_AI.png" />

      <link rel="icon" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
    </>
  );
}


