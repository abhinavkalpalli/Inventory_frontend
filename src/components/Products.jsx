import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  addProduct,
  getProducts,
  getCustomers,
  sellProduct,
  editProduct,
  deleteProduct,
} from "../services/apiMethods";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { uploadImageToCloudinary } from "../hooks/cloudinary";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts(page);
    fetchCustomers();
  }, [page]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async (page) => {
    try {
      const response = await getProducts();
      if (response.status === 200) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      if (response.status === 200) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  const handleSell = (product) => {
    setSelectedProduct(product);
    setOpenSell(true);
  };

  const handleSellSubmit = async () => {
    if (!selectedCustomer || quantity <= 0) {
      toast.error("Please select a customer and enter a valid quantity.");
      return;
    }
    if (selectedProduct.quantity < quantity) {
      toast.error(
        "Please enter a quantity less than or equal to stock quantity."
      );
      return;
    }

    const data = {
      productId: selectedProduct._id,
      quantity,
      customerId: selectedCustomer,
      date: new Date().toISOString().split("T")[0],
      totalPrice: selectedProduct.price * quantity,
    };

    try {
      const response = await sellProduct(data);
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct._id
              ? { ...product, quantity: product.quantity - quantity }
              : product
          )
        );
        toast.success(`${quantity} units of ${selectedProduct.name} sold`);
        setOpenSell(false);
        setSelectedCustomer("");
        setQuantity(1);
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  const handleOpenAdd = (product = null) => {
    if (product) {
      setIsEditing(true);
      setNewProduct({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
      });
      setSelectedProduct(product);
    } else {
      setIsEditing(false);
      setNewProduct({
        name: "",
        description: "",
        quantity: "",
        price: "",
        image: "",
      });
    }
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setSelectedProduct(null);
  };
  const itemsPerPage = 4;
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const handleAddOrEditProduct = async () => {
    try {
      let imgUrl = newProduct.image;

      if (typeof newProduct.image !== "string") {
        imgUrl = await uploadImageToCloudinary(newProduct.image);
      } else if (!imgUrl && selectedProduct) {
        imgUrl = selectedProduct.image;
      }

      const nameInUpper = newProduct.name.toUpperCase();
      const product = { ...newProduct, image: imgUrl, name: nameInUpper };

      if (isEditing) {
        let updatedProduct = { ...selectedProduct, ...product };

        if (typeof newProduct.image !== "string") {
          updatedProduct = { ...updatedProduct, image: imgUrl };
        }

        const response = await editProduct(updatedProduct);
        if (response.status === 200) {
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p._id === updatedProduct._id ? updatedProduct : p
            )
          );
          toast.success("Product Updated Successfully");
        }
      } else {
        const response = await addProduct(product);
        if (response.status === 200) {
          const createdProduct = response.data.product;
          setProducts((prevProducts) => [...prevProducts, createdProduct]);
          toast.success("Product Added Successfully");
        }
      }

      setOpenAdd(false);
      setNewProduct({
        name: "",
        description: "",
        quantity: "",
        price: "",
        image: "",
      });
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const handleDelete = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteProduct({ productId });
          if (response.status === 200) {
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product._id !== productId)
            );
            toast.success("Product Deleted Successfully");
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
          }
        } catch (error) {
          toast.error(error?.response?.message || error?.message);
        }
      }
    });
  };

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px" }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenAdd(null)}
        sx={{ marginBottom: "20px" }}
      >
        Add Product
      </Button>

      <Grid container spacing={3} justifyContent="center">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card sx={{ maxWidth: 240 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.description}</Typography>
                  <Typography variant="body1">
                    Quantity: {product.quantity}
                  </Typography>
                  <Typography variant="body1">
                    Price: ₹{product.price}
                  </Typography>
                </CardContent>
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  paddingBottom={2}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleSell(product)}
                    >
                      Sell
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleOpenAdd(product)}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No products found
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Quantity"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: e.target.value })
            }
            type="number"
            fullWidth
            margin="dense"
          />
          <TextField
            label="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            type="number"
            fullWidth
            margin="dense"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button onClick={handleAddOrEditProduct}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSell} onClose={() => setOpenSell(false)}>
        <DialogTitle>Sell Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Customer"
            select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            fullWidth
            margin="dense"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSell(false)}>Cancel</Button>
          <Button onClick={handleSellSubmit}>Sell</Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" justifyContent="center" mt={3}>
        {filteredProducts.length > itemsPerPage && (
          <Box sx={{ marginTop: "20px" }}>
            <Pagination
              count={Math.ceil(filteredProducts.length / itemsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Products;
