export const metadata = {
  title: 'TechBlog API',
  description: 'Backend API for TechBlog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
