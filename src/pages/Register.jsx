import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    category: "",
    email: "",
  });

  const [domainAvailable, setDomainAvailable] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "domain") {
      setDomainAvailable(null);
      setError("");
    }
  };

  const checkDomain = async () => {
    if (!formData.domain) return;
    
    setIsCheckingDomain(true);
    try {
      const response = await axios.get(
        `https://interview-task-green.vercel.app/task/domains/check/${formData.domain}.expressitbd.com`
      );
      if (response.data.taken) {
        setDomainAvailable(false);
        setError("Not Available Domain, Re-enter!");
      } else {
        setDomainAvailable(true);
        setError("");
      }
    } catch {
      setError("Failed to check domain");
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.name.length < 3) {
      setError("Store name must be at least 3 characters long");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Invalid email format!");
      return;
    }

    if (!domainAvailable) {
      setError("Please use an available domain before submitting.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        currency: "BDT",
        country: "Bangladesh",
        domain: formData.domain,
        category: formData.category,
        email: formData.email,
      };

      await axios.post(
        "https://interview-task-green.vercel.app/task/stores/create",
        payload
      );

      setSuccess("Store created successfully!");
      setError("");
      window.location.href = "/products";
    } catch {
      setError("Store creation failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Steps */}
      <div className="w-1/3 bg-blue-600 text-white p-10">
        <h2 className="text-2xl font-bold mb-8">Setup Your Store</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">1</div>
            <div>
              <h3 className="font-bold text-lg">Store Information</h3>
              <p className="text-blue-100">Give your  store name</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="border-2 border-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">2</div>
            <div>
              <h3 className="font-medium text-lg">Store Location</h3>
              <p className="text-blue-200">where is your store located</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="border-2 border-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">3</div>
            <div>
              <h3 className="font-medium text-lg">Add Products</h3>
              <p className="text-blue-200">Start adding your products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-2/3 p-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-5">Create a store</h1>
          <p className="text-gray-600 mb-6">Add your basic store information and complete the setup</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input
                className={`w-full border p-2 rounded ${
                  formData.name.length > 0 && formData.name.length < 3 ? "border-red-500" : ""
                }`}
                type="text"
                name="name"
                placeholder="How'd you like to call your store?"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {formData.name.length > 0 && formData.name.length < 3 && (
                <p className="text-red-500 text-sm mt-1">
                  Store name must be at least 3 characters long
                </p>
              )}
              {formData.name.length >= 3 && (
                <p className="text-green-600 text-sm mt-1">
                  Store name is valid
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Store Domain</label>
              <div className="flex items-center">
                <input
                  className={`w-full border p-2 rounded ${
                    domainAvailable === false ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="domain"
                  placeholder="enter your domain name"
                  value={formData.domain}
                  onChange={handleChange}
                  onBlur={checkDomain}
                  required
                />
                <span className="ml-2 whitespace-nowrap">.expressitbd.com</span>
              </div>
              {isCheckingDomain && <p className="text-sm text-gray-500">Checking domain...</p>}
              {error && domainAvailable === false && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              {domainAvailable && (
                <p className="text-green-600 text-sm">Domain is available!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Store Category</label>
              <input
                className="w-full border p-2 rounded"
                type="text"
                name="category"
                placeholder="Fashion"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Store Email</label>
              <input
                className="w-full border p-2 rounded"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {error && !domainAvailable === false && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="bg-white text-blue-600 border border-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 hover:text-blue-700 w-full font-medium shadow-md transition duration-200">
                  Create store
              </button>
            </div>

            {success && <p className="text-green-600 text-center">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}