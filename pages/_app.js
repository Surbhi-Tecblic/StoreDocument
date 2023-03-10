/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Tecblic Sign App</p>
        <div className="flex mt-4">
          <Link href="/" className="mr-4 text-pink-500">
            {/* <a className="mr-4 text-pink-500"> */}
              Home
            {/* </a> */}
          </Link>
          <Link href="/addUser" className="mr-4 text-pink-500">
            {/* <a className="mr-6 text-pink-500"> */}
              Add User
            {/* </a> */}
          </Link>
          <Link href="/view" className="mr-4 text-pink-500">
            {/* <a className="mr-6 text-pink-500"> */}
              View PDF
            {/* </a> */}
          </Link>
          <Link href="viewDoc" className="mr-4 text-pink-500">
            {/* <a className="mr-6 text-pink-500"> */}
              Fetch PDF
            {/* </a> */}
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp