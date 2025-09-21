import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { paginationItems } from "../../constants";

function ProductTable() {
  const [itemType, setItemType] = useState("");
  const [itemId, setItemId] = useState("");
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [qty, setQty] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [originalItems, setOriginalItems] = useState([]);
  const [IdSet, setIdSet] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const imagePath = "http://localhost/api/products/";

  // Order statuses
const statuses = ["Order Placed", "In Transit", "Out for Delivery", "Delivered"];

  const getItemsDB = () => {
    setLoading(true); // Start loading
    axios
      .get(
        "http://localhost/api/get_product.php"
      )
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
        setOriginalItems(res.data);
        setLoading(false); // Stop loading if there's an error
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false); // Stop loading if there's an error
      });
  };

  const handleDelete = (id, table) => {
    // Convert singular type to plural table name (same as handleupdate)
    const tableMap = {
      'phone': 'phones',
      'tablet': 'tablets', 
      'watch': 'watches',
      'accessory': 'accessories'
    };
    
    const pluralTable = tableMap[table] || table;
    console.log('Deleting product:', { id, originalType: table, tableToUse: pluralTable });
    
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(
          `http://localhost/api/delete_product.php/${id}/${pluralTable}`
        )
        .then((response) => {
          console.log('Delete response:', response.data);
          if (response.data.error) {
            alert("Error: " + response.data.error);
          } else {
            alert("Item deleted successfully!");
            getItemsDB();
            setSearchQuery(""); // Clear the search query after deletion
          }
        })
        .catch((err) => {
          console.error('Delete error:', err);
          if (err.response && err.response.data) {
            alert("Error: " + (err.response.data.error || err.response.data));
          } else {
            alert("Error deleting product: " + err.message);
          }
        });
    }
  };

  const handleCancelUpdate = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel updating the Item? Any unsaved changes will be lost."
      )
    ) {
      clearData();
    }
  };

  const clearData = () => {
    setItemId("");
    setProductName("");
    setImage("");
    setPrice("");
    setProductCondition("");
    setIdSet(null); // Reset to null (initial state)
    setColor("");
    setImagePreview("");
    setItemType("");
    setAvailability("");
    setDescription("");
    setQty("");
    setNewImagePreview("");
  };

  const handleupdate = (Id , table) => {
    clearData();
    
    // Convert singular type to plural table name
    const tableMap = {
      'phone': 'phones',
      'tablet': 'tablets', 
      'watch': 'watches',
      'accessory': 'accessories'
    };
    
    const pluralTable = tableMap[table] || table;
    console.log('Updating product:', { Id, originalType: table, tableToUse: pluralTable });
    
    axios
      .get(
        `http://localhost/api/get_product.php/${Id}/${pluralTable}`
      )
      .then((res) => {
        console.log('Product data loaded:', res.data);
        const {
          id,
          productName,
          imageName,
          condition,
          availability,
          price,
          description,
          color,
          type,
          qty
        } = res.data;
        
        console.log('Setting form data:', {
          id, productName, price, description, color, condition, availability, qty, imageName
        });
        
        setItemId(id);
        setProductName(productName);
        setImage(null);
        setPrice(price);
        setDescription(description);
        setIdSet(id);
        setColor(color);
        setAvailability(availability);
        setProductCondition(condition);
        setQty(qty || '');
        setImagePreview(imageName);
        setItemType(pluralTable); // Use plural form for updates
        
        console.log('Form state updated, IdSet:', id);
      })
      .catch((err) => {
        console.error('Error loading product data:', err);
        alert("Error loading product data: " + err.message);
      });
  };

  const sendUpdatedData = () => {
    console.log('Update data:', { itemId, productName, price, description, color, productCondition, availability, qty, itemType });
    
    if (!itemId || !price || !description) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append('id', itemId);
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('color', color);
    formData.append('condition', productCondition);
    formData.append('availability', availability);
    formData.append('qty', qty);
    formData.append('type', itemType);
  
    if (image) {
      formData.append('image', image);
    }

    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    axios
      .post(`http://localhost/api/update_product.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Update response:', response.data);
        if (response.data.error) {
          alert("Error: " + response.data.error);
        } else {
          alert("Item updated successfully");
          getItemsDB();
          clearData();
        }
      })
      .catch((err) => {
        console.error('Update error:', err);
        if (err.response && err.response.data) {
          alert("Error: " + err.response.data.error || err.response.data);
        } else {
          alert("Error updating product: " + err.message);
        }
      });
  };


  
  const sendData = async (e) => {
    e.preventDefault();

    if (!productName || !price || !color || !description || !image || !qty) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('type' , itemType)
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('color', color);
    formData.append('condition', productCondition);
    formData.append('availability', availability);
    formData.append('description', description);
    formData.append('qty', qty);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost/api/save_product.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      response.data.error && alert(response.data.error);
      response.data.message && alert(response.data.message);
      // Clear form fields after successful submission
      setProductName('');
      setPrice('');
      setColor('');
      setProductCondition('new');
      setAvailability('available');
      setDescription('');
      setQty('');
      setImagePreview(null);
      setImage(null);
      getItemsDB();
      setNewImagePreview(null);

    } catch (error) {
      console.error('There was an error uploading the product!', error);
      alert('Failed to upload product. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview("");
        setNewImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImage(null);
      setNewImagePreview(null);
    }
  };


  useEffect(() => {
    if (items.length === 0) {
      getItemsDB();
      console.log("Get data From DB");
    }
  }, []);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredItems = originalItems.filter(
      (Item) =>
        
        Item.productName.toLowerCase().includes(query)
    );
    setItems(filteredItems);
  };

  

  return (
    <div class="w-full h-full px-24 py-8 bg-white rounded-2xl">
      <div class="flex">
        <h1 class="text-3xl font-bold mb-4 w-full">Product Management</h1>
      </div>

      <br />

      <div
        label="serch bar"
        className="mt-[-2%] mb-5 text-center font-medium text-lg"
      >
        <h3 className="bg-green-50">Search Bar</h3>
        <label
          for="default-search"
          class="mb-2 text-m font-bold text-gray-900 sr-only dark:text-black"
        >
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-300 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="default-search"
            value={searchQuery}
            onChange={handleInputChange}
            class="block w-full p-4 ps-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by Item Name"
            required
          />
        </div>
      </div>

      <div class="overflow-x-auto overflow-y-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200 ">

            {["Product Type", "Product Name", "Image", "Price", "Color" , "New Or Old",  "Availability" , "Quantity", "Description" , "Update" , "Delete"] .map((head) => (
                <th
                  key={head}
                  className="border-y border-gray-100 bg-gray-50/50 p-2"
                >
                  {head}
                </th>
              ))}
 
            </tr>
          </thead>
          <tbody id="attendees-list">
            {items.map((item) => (
              <tr key={item.id} className="text-center ">
                <td class="border border-gray-300 px-4 py-2">
                  {item.type}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {item.productName}{" "}
                </td>
                <td class="border border-gray-300 px-4 py-2 ">
                  
                  <img src={imagePath+item.imageName} className="w-20 h-20" />
                  {/* {console.log(imagePath+item.imageName)} */}
                </td>
                <td class="border border-gray-300 px-4 py-2">{item.price}</td>
                <td class="border border-gray-300 px-4 py-2">
                  {item.color}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {item.condition == "yes" ? "New" : "Old"}
                </td>

                <td class="border border-gray-300 px-4 py-2">
                  {item.availability == "yes"? "Available" : "Out Of Stock"}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {item.qty || 0}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {item.description	}
                </td>

                <td class="border border-gray-300 px-4 py-2 ">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleupdate(item.id , item.type)}
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 7V2.2a2 2 0 0 0-.5.4l-4 3.9a2 2 0 0 0-.3.5H8Zm2 0V2h7a2 2 0 0 1 2 2v.1a5 5 0 0 0-4.7 1.4l-6.7 6.6a3 3 0 0 0-.8 1.6l-.7 3.7a3 3 0 0 0 3.5 3.5l3.7-.7a3 3 0 0 0 1.5-.9l4.2-4.2V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M17.4 8a1 1 0 0 1 1.2.3 1 1 0 0 1 0 1.6l-.3.3-1.6-1.5.4-.4.3-.2Zm-2.1 2.1-4.6 4.7-.4 1.9 1.9-.4 4.6-4.7-1.5-1.5ZM17.9 6a3 3 0 0 0-2.2 1L9 13.5a1 1 0 0 0-.2.5L8 17.8a1 1 0 0 0 1.2 1.1l3.7-.7c.2 0 .4-.1.5-.3l6.6-6.6A3 3 0 0 0 18 6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>

                <td class="border border-gray-300 px-4 py-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id , item.type)}
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}


 <tr className="text-center">
  {/* Product Name */}
  <td className="border border-gray-300 px-4 py-2">
  {!IdSet &&(
        <div className="mb-4">
        <label htmlFor="availability" className="block text-m font-bold text-gray-600">
          Product Type
        </label>
        <select
          id="type"
          name="type"
          className="mt-1 p-2 w-full border rounded-md"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
        >
          <option value="">Select Item Type</option>
          <option value="phones">Mobile Phone</option>
          <option value="tablets">Tablet</option>
          <option value="watches">Smart Watch</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>
  )}
  </td>
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="productName" className="block text-m font-bold text-gray-600">
        Product Name
      </label>
      <input
        type="text"
        id="productName"
        name="productName"
        className="mt-1 p-2 w-full border rounded-md"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
    </div>
  </td>

  {/* Product Image */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="productImage" className="block text-m font-bold text-gray-600">
        Product Image
      </label>
      <input
                type="file"
                id="productImage"
                name="productImage"
                accept="image/*"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                 src={  imagePath+imagePreview }
                  alt="Product Preview"
                  className="mt-2 h-20 w-20 object-cover"
                />
              )}
              {newImagePreview && (
                <img
                 src={newImagePreview}
                  alt="Product Preview"
                  className="mt-2 h-20 w-20 object-cover"
                />
              )}
              
    </div>
  </td>

  {/* Price */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="price" className="block text-m font-bold text-gray-600">
        Price
      </label>
      <input
        type="number"
        id="price"
        name="price"
        className="mt-1 p-2 w-full border rounded-md"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
  </td>

  {/* Color */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="color" className="block text-m font-bold text-gray-600">
        Color
      </label>
      <input
        type="text"
        id="color"
        name="color"
        className="mt-1 p-2 w-full border rounded-md"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  </td>

  {/* Product Condition */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="productCondition" className="block text-m font-bold text-gray-600">
        Product Condition
      </label>
      <select
        id="productCondition"
        name="productCondition"
        className="mt-1 p-2 w-full border rounded-md"
        value={productCondition}
        onChange={(e) => setProductCondition(e.target.value)}
      >
        <option value="">Select Condition</option>
        <option value="yes">New</option>
        <option value="no">Old</option>
      </select>
    </div>
  </td>

  {/* Availability */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="availability" className="block text-m font-bold text-gray-600">
        Availability
      </label>
      <select
        id="availability"
        name="availability"
        className="mt-1 p-2 w-full border rounded-md"
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
      >
        <option value="">Select Availability</option>
        <option value="yes">Available</option>
        <option value="no">Not Available</option>
      </select>
    </div>
  </td>

  {/* Quantity */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="qty" className="block text-m font-bold text-gray-600">
        Quantity
      </label>
      <input
        type="number"
        id="qty"
        name="qty"
        min="0"
        className="mt-1 p-2 w-full border rounded-md"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
    </div>
  </td>

  {/* Description */}
  <td className="border border-gray-300 px-4 py-2">
    <div className="mb-4">
      <label htmlFor="description" className="block text-m font-bold text-gray-600">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        placeholder="Type Description Here..."
        rows="3"
        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  </td>
              <td class="border border-gray-300 px-4 py-2">
                <button class="p-2 text-red-600 " onClick={clearData}>
                  <svg
                    class="w-6 h-6 "
                    stroke="currentColor"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex w-2/3 justify-center mx-auto mt-8">
        <div>
          {IdSet ? (
            <button
              onClick={sendUpdatedData}
              class="select-none font-bold  text-xs py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-900 text-white shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 flex  gap-3 mt-4"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                stroke-width="2"
                class="h-4 w-4"
              >
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
              "UPDATE ITEM"
            </button>
          ) : (
            <button
              onClick={sendData}
              class="select-none font-bold  text-xs py-2 px-4 rounded-lg  bg-gray-700 hover:bg-gray-900 text-white shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 flex  gap-3 mt-4"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              "ADD ITEM"
            </button>
          )}

          {IdSet ? (
            <button
              class=" m-2 ml-10 select-none font-bold  text-xs py-2 px-4 rounded-lg bg-red-900 hover:bg-red-600 text-white shadow-red-900/10 hover:shadow-lg hover:shadow-gray-900"
              onClick={handleCancelUpdate}
            >
              CANCEL
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      <div class="w-full pt-5 px-4 mb-8 mx-auto text-center "></div>
    </div>
  );
}

export default ProductTable;
