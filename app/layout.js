import './globals.css'

export const metadata = {
  title: 'Pokédex',
  description: 'Responsive Pokédex with Next.js + Tailwind'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen">
          <main className="max-w-10xl mx-auto p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
