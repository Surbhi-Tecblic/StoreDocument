import React, { useEffect, useState } from "react";

// import ChipInput from "material-ui-chip-input";
const UserTable = ({ uploadToIPFS, addUserWhoNeedsToSign }) => {

  const [names, setNames] = useState([])
  const [inputVal, setInputVal] = useState('')

  const [emails, setEmails] = useState([])
  const [emailVal, setEmailVal] = useState('')


  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [fileUrl, setFileUrl] = useState("")


  // const handleChange = (e) => {
  //   const val = e.target.value
  //   setInputVal(e.target.value)
  //   if (e.key === "Enter") {
  //     //  setInputVal('')
  //     setNames(prev => [...prev, e.target.value])
  //   }
  //   console.log("value", val)

  // }

  // const onRemove = (ind) => {
  //   const newState = names.filter((name, i) => i != ind)
  //   setNames(newState)
  // }

  // const handleChanges = (e) => {
  //   const value = e.target.value
  //   if (e.key === "Enter") {
  //     setEmails(prev => [...prev, e.target.value])
  //   }
  //   console.log("value", value)
  // }

  // const onRemoved = (em) => {
  //   const newState = emails.filter((email, i) => i != em)
  //   setEmails(newState)
  // }

  return (
    <div className=" mt-28">
      <div className="flex items-center justify-center my-6 ">
        <form className="max-w-2xl w-full mx-4">

          <div class="mb-6">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your name
            </label>
            <input
              // onKeyDown={(e) => handleChange(e)}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />

          </div>

          {/* <div className="flex gap-2">
            {names && names.map((name, i) => {
              return (
                <div key={i} class="flex flex-wrap justify-center space-x-2">
                  <span
                    className="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">
                    {name}
                    <button type="button" onClick={() => onRemove(i)} className="bg-transparent hover focus:outline-none">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
                        className="w-3 ml-3" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 352 512">
                        <path fill="currentColor"
                          d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
                        </path>
                      </svg>
                    </button>
                  </span>
                </div>
              )
            })}
          </div> */}

          <div className="mb-6">
            <label
              For="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              // onKeyDown={(e) => handleChanges(e)}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="name@tecblic.com"
              required
            />
          </div>

          {/* <div className="flex gap-2">
            {emails && emails.map((email, i) => {
              return (
                <div key={i} class="flex flex-wrap justify-center space-x-2">
                  <span
                    className="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">
                    {email}
                    <button type="button" onClick={() => onRemoved(i)} className="bg-transparent hover focus:outline-none">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
                        className="w-3 ml-3" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 352 512">
                        <path fill="currentColor"
                          d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
                        </path>
                      </svg>
                    </button>
                  </span>
                </div>
              )
            })}
          </div> */}




          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
          <input
            type="file"
            name="Asset"
            className="my-4"
            // onChange={}
          />
          {
            fileUrl && (
              <img className="rounded mt-4" width="350" src={fileUrl} />
            )
          }
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register New User
          </button>
        </form>
      </div>

      <div className="overflow-x-auto w-full  p-4">
        <table className="mx-auto  w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden">
          <thead className="bg-gray-900">
            <tr className="text-white text-left">
              <th className="font-semibold text-sm uppercase px-6 py-4">
                {" "}
                Name{" "}
              </th>
              <th className="font-semibold text-sm uppercase px-6 py-4">
                {" "}
                Email{" "}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex w-10 h-10">
                    {" "}
                    <img
                      className="w-10 h-10 object-cover rounded-full"
                      alt="User avatar"
                      src="https://i.imgur.com/siKnZP2.jpg"
                    />{" "}
                  </div>
                  <div>
                    <p> Mira Rodeo </p>
                    <p className="text-gray-500 text-sm font-semibold tracking-wide">
                      {" "}
                      mirarodeo23@mail.com{" "}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className=""> Software Developer </p>
                <p className="text-gray-500 text-sm font-semibold tracking-wide">
                  {" "}
                  Development{" "}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
