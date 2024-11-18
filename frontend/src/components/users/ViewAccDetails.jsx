import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const ViewAccDetails = () => {
  const { id } = useParams(); // Extract the account ID from the URL
  const [data, setData] = useState(null);
  const [selectedApp, setSelectedApp] = useState("Google");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/FetchSingleAccount/${id}`
        );
        console.log("Fetched account details:", response.data.analysis);

        const accountDetails = {
          account: response.data.account,
          password: response.data.password,
          analysis: response.data.analysis,
        };

        setData(accountDetails);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0e397e] to-[#75a6a3]">
        <h1 className="text-4xl font-semibold mb-8">Loading Account Details...</h1>
      </div>
    );
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const updatedAccount = {
      name: data.account.name,
      username: data.account.username,
      description: data.account.description,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/UpdateAccount/${id}`,
        updatedAccount
      );
      console.log("Account updated successfully:", response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update the account.");
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const pass = {
      password: password, // Use the password from state here
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/CheckNewAnalysis/${id}`,
        pass
      );
      console.log("Account updated successfully:", response.data);
      toast.success(response.data.detail);
      setData((prevData) => ({
        ...prevData,
        analysis: response.data.analysis, // Update the analysis part of the state
      }));
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update the account.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      account: {
        ...prevData.account,
        [name]: value,
      },
    }));
  };

  const handleAppChange = (event) => {
    setSelectedApp(event.target.value);
  };

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const appLogos = {
    Google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    Facebook: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    Instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    Youtube: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
    Tiktok: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    Other: "https://via.placeholder.com/150",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0e397e] to-[#75a6a3] pb-8">
      <h1 className="text-4xl font-semibold mb-8">View Account Details</h1>
      <div className="flex w-full max-w-4xl pt-8 flex-col md:flex-row">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <img
            src={'http://127.0.0.1:8000' + data.account.image}
            alt={`${selectedApp} logo`}
            className="w-32 h-32 mb-4 md:mb-0 md:mr-8 object-contain"
          />
          <div className="w-full">
          <form>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select App
            </label>
            <select
              className="w-full p-2 mb-4 border rounded-lg"
              value={data.account.name}
              onChange={handleAppChange}
              
              name="name"
            >
              <option value="Google">Google</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">Youtube</option>
              <option value="Tiktok">Tiktok</option>
              <option value="Other">Other apps</option>
            </select>
            {selectedApp === "Other" && (
              <div className="w-full mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  App Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter the app name"
                  value={data.account.name || ""}
                  onChange={handleInputChange}
                  name="name"
                />
              </div>
            )}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter your username"
              name="username"
              value={data.account.username || ""}
              onChange={handleInputChange}
              
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              placeholder="Enter a description"
              value={data.account.description || ""}
              onChange={handleInputChange}
             name="description"
            />
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="bg-blue-500 text-white p-2 rounded-lg mt-4 hover:bg-blue-700"
            >
              Update?
            </button>
          </form>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-8 flex flex-col">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Did you change your password?</h2>
        <div className="flex items-center">
          <input
            type={passwordVisible ? "text" : "password"} // Toggle between password and text
            className="w-full p-2 border rounded-lg password"
            name="password"
            value={password} // Bind the value of the input to the state
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlePasswordVisibilityToggle} className="ml-2">
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
          <div className="flex flex-col w-full">
          
          <button 
          className="bg-blue-500 text-white p-2 rounded-lg ml-3 hover:bg-blue-700"
          onClick={handlePasswordChange}
          >
            Check Password
          </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-8 flex flex-col">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Analysis of Existing Password</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200">Entropy</th>
              <th className="py-2 px-4 border-b border-gray-200">Estimated Cracking Time</th>
              <th className="py-2 px-4 border-b border-gray-200">Remarks</th>
            </tr>
          </thead>
          <tbody>
                <tr >
                  <td className="py-2 px-4 border-b border-gray-200">
                    {data.analysis.entropy}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {data.analysis.estimated_cracking_time}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {data.analysis.remarks}
                  </td>
                </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAccDetails;
