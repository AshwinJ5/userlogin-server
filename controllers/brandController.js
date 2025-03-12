const Brands=require('../Schema/brandModel')
const path = require("path");
const fs = require("fs");

// add new brand
exports.addNewBrand = async (req, res) => {
    const { brandName, brandCategory } = req.body;
    const id  = req.userId;

    try {
        const categoriesArray = typeof brandCategory === "string"
            ? brandCategory.split(",").map(category => category.trim().toLowerCase())
            : brandCategory;

        const existingBrand = await Brands.findOne({ brandName });
        if (existingBrand) {
            return res.status(406).json({ message: "Brand already exists" });
        }

        const newBrand = new Brands({
            brandName,
            brandCategory: categoriesArray,
            brandImage: req.file ? `/Uploads/brands/${req.file.filename}` : "",
            userId:id
        });

        await newBrand.save();

        return res.status(201).json({ message: "Brand added successfully", newBrand });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// update an existing brand
exports.updateBrand=async(req,res)=>{
    const { brandName, brandCategory } = req.body;
    const { id } = req.params;

    try {
        const existingBrand = await Brands.findById(id);
        if (!existingBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        let updateBrandData = {};
        if (brandName) updateBrandData.brandName = brandName;

        if (brandCategory) {
            if (typeof brandCategory === "string") {
                updateBrandData.brandCategory = brandCategory.split(",").map((category) => category.trim().toLowerCase());
            } else if (Array.isArray(brandCategory)) {
                updateBrandData.brandCategory = brandCategory.map((category) => category.trim().toLowerCase());
            }
        }
        if (req.file) {
                    if (existingBrand.brandImage) {
                        const oldImagePath = path.join(__dirname, "../Uploads/brands", existingBrand.brandImage);
                        if (fs.existsSync(oldImagePath)) {
                            try {
                                fs.unlinkSync(oldImagePath);
                            } catch (err) {
                                console.error("Error deleting old image:", err);
                            }
                        }
                    }
                    updateBrandData.brandImage = req.file.filename;
                }

        if (Object.keys(updateBrandData).length === 0) {
            return res.status(400).json({ message: "No data provided for updating" });
        }

        const updatedBrandDatas = await Brands.findByIdAndUpdate(id, updateBrandData, { new: true });

        res.status(200).json({ message: "Brand details updated successfully", brand: updatedBrandDatas });
    } catch (error) {
        console.error("Update brand Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// delete a brand 
exports.deleteABrand=async(req,res)=>{
    const { id } = req.params;

    try {
        const brand=await Brands.findById(id);
        
        if(!brand){
            return res.status(404).json({ message: "No brand found for deleting" });
        }
                if (brand.brandImage) {
                    const imagePath = path.join(__dirname, "..", brand.brandImage);
                    
                    if (fs.existsSync(imagePath)) {
                        try {
                            fs.unlinkSync(imagePath);
                        } catch (err) {
                            console.error("Error deleting image:", err);
                        }
                    }
                }
                await Brands.findByIdAndDelete(id);
                
                        res.status(200).json({ message: "Brand deleted successfully" });
        
    } catch (error) {
        console.error("Delete Brand Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}