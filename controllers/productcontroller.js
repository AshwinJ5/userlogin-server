const Products = require("../Schema/productModel");
const bcrypt = require("bcryptjs");
const users = require("../Schema/userModel");

// add new products 
exports.addNewProducts = async (req, res) => {
    const { productName, brand, description, discountedPrice, actualPrice, productCategory } = req.body;
    const id  = req.userId;

    try {
        const existingProduct = await Products.findOne({ productName });
        if (existingProduct) {
            res.status(406).json({message:"Product name already taken"});
        } else {
            const newProduct = new Products({
                productName,
                brand,
                userId:id,
                description,
                discountedPrice,
                actualPrice,
                productCategory,
            });
            await newProduct.save()
            res.status(200).json(newProduct)
        }
    } catch (error) {
        res.status(401).json(error);
    }
};

//edit a product by added user only
exports.updateProduct = async (req, res) => {
    const { productName, brand, description, discountedPrice, actualPrice, productCategory } = req.body;
    const { id } = req.params;
    const userId = req.userId;    

    try {
        const existingProduct = await Products.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (existingProduct.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to update this product" });
        }

        let updateProductData = {};
        if (productName) updateProductData.productName = productName;
        if (brand) updateProductData.brand = brand;
        if (description) updateProductData.description = description;
        if (discountedPrice) updateProductData.discountedPrice = discountedPrice;
        if (actualPrice) updateProductData.actualPrice = actualPrice;
        if (productCategory) updateProductData.productCategory = productCategory;

        if (Object.keys(updateProductData).length === 0) {
            return res.status(400).json({ message: "No data provided for updating" });
        }

        const updatedProductDatas = await Products.findByIdAndUpdate(id, updateProductData, { new: true });

        res.status(200).json({ message: "Product details updated successfully", product: updatedProductDatas });
    } catch (error) {
        console.error("Update product Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get all products
exports.getAllProducts = async (req, res) => {
    try {
        const userid=req.userId
        const user = await users.findById(userid);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const allProducts = await Products.find({
            userId: { $nin: user.blockedUsers } 
        });
        
        if (!allProducts.length) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(401).json(error);
    }
};

// get all products added by user
exports.getUsersProducts = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;        

    try {
        const allUserProducts = await Products.find({userId:id});
        if (id !== userId) {
            return res.status(403).json({ message: "Unauthorized to view product" });
        }
        if (!allUserProducts.length) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(allUserProducts);
    } catch (error) {
        res.status(401).json(error);
    }
};

//delete a users product
exports.deleteAProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;    

    try {
        const products = await Products.findById(id);
        if (products.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to view product" });
        }
        if (!products) {
            return res.status(404).json({ message: "No Products found for deleting" });
        }

        await Products.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully",productname:products.productName });
    } catch (error) {
        console.error("Delete product Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
