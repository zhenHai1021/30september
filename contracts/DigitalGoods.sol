// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
/**
 Website  : 
 Telegram : 
 Twitter  : 
**/

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address payable account) external view returns (uint256);
    function transfer(address payable recipient, uint256 amount) external returns (bool);
    function allowance(address payable owner, address payable spender) external view returns (uint256);
    function approve(address payable spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval( address indexed owner, address indexed spender, uint256 value);
}

contract DigitalGoods {
    address payable private contractOwner;
    IERC20 public paymentToken;

    constructor() {
        contractOwner = payable(msg.sender);
        paymentToken = IERC20(address(0x45dcB8FcC18cf26857C140985b8f61106B498f08));
        //#1
        //0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
        //0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        //0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
        //0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB

        createProduct("#1", "D#1", 100, address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4), "d");
        createProduct("#2", "D#2", 200, address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), "d");
        createProduct("#3", "D#3", 100, address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4), "d");
        createProduct("#4", "D#3", 200, address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4), "d");

        createSeller("#S1", "S#1", address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
        createSeller("#S2", "S#2", address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
        createSeller("#S3", "S#3", address(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
    }

    struct Product {
        string name;
        string description;
        uint256 price;
        string productID;
        string ipfsCID;
        address payable ownerAddress;
        bool sold;
    }

    struct Seller{
        string name;
        address payable sellerAddress;
        string bio;
        string sellerID;
        uint256 productsOwned;
    }

    struct Review {
        string comments;
        string commentTimeStamp;
        string sellerID;
    }

    mapping(address => Product[]) internal productList;
    mapping(address => Seller[]) internal sellerList;
    mapping(address=> Review[]) internal reviewList;
    event CreatedProduct(address indexed _product, Product product);
    event CreatedSeller(address indexed _seller, Seller seller);

    modifier onlyOwner() {
        require(
            msg.sender == contractOwner,
            "Only contract owner can perform this action"
        );
        _;
    }

    function getContractOwner() internal view returns (address) {
        return contractOwner;
    }

    function generateProductID() internal view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "MFT",
                    generateRandomNumber(3, 1),
                    "-",
                    generateRandomString(7, 1)
                )
            );
    }

    function generateSellerID() internal view returns (string memory){
        return string(
            abi.encodePacked(
                "SSS", generateRandomNumber(5, 2),
                "-",
                generateRandomString(5, 2)
            )
        );
    }

    function generateRandomNumber(uint256 _length, uint256 x)
        internal
        view
        returns (string memory)
    {
        bytes memory randomNum = new bytes(_length);
        bytes memory chars;
        if (x >= 0 && x <= 4) {
            if (x == 0) {
                chars = "9412536874";
            } else if (x == 1) {
                chars = "4261579803";
            } else if (x == 2) {
                chars = "5731864792";
            } else if (x == 3) {
                chars = "4732169582";
            } else if (x == 4) {
                chars = "9421837501";
            }
            for (uint256 i = 0; i < _length; i++) {
                randomNum[i] = chars[random(10, i)];
            }
            return string(randomNum);
        }
        return "";
    }

    function random(uint256 number, uint256 counter)
        internal
        view
        returns (uint256)
    {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        counter
                    )
                )
            ) % number;
    }

    function generateRandomString(uint256 length, uint256 x)
        internal
        view
        returns (string memory)
    {
        require(length >= 1 && length <= 14, "Length must be between 1 and 14");
        bytes memory randomWord = new bytes(length);
        bytes memory chars;

        if (x == 0) {
            chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        } else if (x == 1) {
            chars = "9876543210ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba";
        } else if (x == 2) {
            chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        } else if (x == 3) {
            chars = "zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA";
        } else if (x == 4) {
            chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        } else {
            return "";
        }

        for (uint256 i = 0; i < length; i++) {
            randomWord[i] = chars[random(chars.length, i)];
        }
        return string(randomWord);
    }

    //TOKEN
    function viewWalletTokenBalance(address payable _address) public view returns(uint256){
        return paymentToken.balanceOf(_address);
    }

    // CREATE
    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        address _ownerAddress,
        string memory _ipfsCID
    ) public onlyOwner {
        Product memory newProduct = Product({
            name: _name,
            description: _description,
            price: _price,
            productID: generateProductID(),
            ownerAddress: payable(_ownerAddress),
            ipfsCID: _ipfsCID,
            sold: false
        });

        productList[msg.sender].push(newProduct);
        emit CreatedProduct(msg.sender, newProduct);
    }

    function createSeller(
        string memory _name, 
        string memory _bio,
        address _sellerAddress
    ) public onlyOwner{
        require(!sellerExists(_sellerAddress), "Seller already exists");
        Seller memory newSeller = Seller({
            name: _name,
            bio: _bio,
            sellerID: generateSellerID(),
            sellerAddress: payable(_sellerAddress),
            productsOwned: 0
        });

        sellerList[msg.sender].push(newSeller);
        emit CreatedSeller(_sellerAddress, newSeller);
    }

    //    string comments;
    //     string commentTimeStamp;
    //     string sellerID;

    function createComment(string memory _comments, string memory _commentTimeStamp, string memory _sellerID) public onlyOwner{
        Review memory newReview = Review({
            comments: _comments,
            commentTimeStamp: _commentTimeStamp,
            sellerID: _sellerID
        });
        reviewList[msg.sender].push(newReview);
    }

    function sellerExists(address _sellerAddress) internal view returns (bool) {
    Seller[] memory sellers = sellerList[_sellerAddress];
    for(uint256 i=0;i<sellers.length;i++){
        if(sellers[i].sellerAddress==_sellerAddress){
            return true;
           
        }
    }
    return false;
}


    // RETRIEVE
    function getAllProduct(address _owner)
        public
        view
        returns (Product[] memory)
    {
        Product[] memory allProducts = new Product[](
            productList[_owner].length
        );

        for (uint256 i = 0; i < productList[_owner].length; i++) {
            allProducts[i] = productList[_owner][i];
        }
        return allProducts;
    }

   function getAllSeller(address _owner) public view returns(Seller[] memory) {
    Seller[] storage seller = sellerList[_owner];
    Seller[] memory allSellers = new Seller[](seller.length);

    for (uint256 i = 0; i < seller.length; i++) {
        uint256 counter = 0;
        for (uint256 j = 0; j < productList[_owner].length; j++) {
            if (productList[_owner][j].ownerAddress == seller[i].sellerAddress) {
                counter++;
            }
        }
        allSellers[i] = seller[i];
        allSellers[i].productsOwned = counter; // Update productsOwned in the memory array
    }

    return allSellers;
}


    function getProductByID (string memory _productID) public view returns (Product memory) {
        Product[] storage product = productList[getContractOwner()];
                for (uint256 i = 0; i < product.length; i++) {
                     if (keccak256(bytes(product[i].productID)) == keccak256(bytes(_productID))) {
                            return product[i];
                     }
                }
            revert("Product not found.");
    }


    function getSellerByAddress(address payable _address) public view returns(Seller memory){
          Seller[] storage seller = sellerList[getContractOwner()];
          for(uint256 i=0;i<seller.length;i++){
           if(seller[i].sellerAddress==_address){
                return seller[i];
            }
        }
        revert("Seller Not Found.");
    }

    function getSellerByID(string memory _sellerID) public view returns(Seller memory) {
    Seller[] storage sellers = sellerList[getContractOwner()];

    for (uint256 i = 0; i < sellers.length; i++) {
        if (keccak256(bytes(sellers[i].sellerID)) == keccak256(bytes(_sellerID))) {
            // Calculate the productsOwned count without modifying state
            uint256 counter = 0;
            for (uint256 j = 0; j < productList[getContractOwner()].length; j++) {
                if (productList[getContractOwner()][j].ownerAddress == sellers[i].sellerAddress) {
                    counter++;
                }
            }
            // Return a copy of the seller with the updated productsOwned count
            Seller memory sellerCopy = sellers[i];
            sellerCopy.productsOwned = counter;
            return sellerCopy;
        }
    }
    revert("Seller Not Found.");
}

function getAllCommentsByID(string memory _sellerID) public view returns(Review[] memory) {
    Review[] storage reviews = reviewList[getContractOwner()];
    uint256 count = 0;

    // First, count the number of matching reviews
    for (uint256 i = 0; i < reviews.length; i++) {
        if (keccak256(bytes(reviews[i].sellerID)) == keccak256(bytes(_sellerID))) {
            count++;
        }
    }

    // Create a new array to hold the matching reviews
    Review[] memory matchingReviews = new Review[](count);
    uint256 index = 0;

    // Collect all matching reviews
    for (uint256 i = 0; i < reviews.length; i++) {
        if (keccak256(bytes(reviews[i].sellerID)) == keccak256(bytes(_sellerID))) {
            matchingReviews[index] = reviews[i];
            index++;
        }
    }

    return matchingReviews;
}

function getAllProductsByAddress(address payable _address) public view returns (Product[] memory){
    Product[] storage products = productList[getContractOwner()];
    uint256 count =0;
      for (uint256 i = 0; i < products.length; i++) {
              if (products[i].ownerAddress == _address) {
                  count++;
              }
      }

      Product[] memory matchingProducts = new Product[] (count);
      uint256 index = 0;
      for (uint256 i = 0; i < products.length; i++) {
         if (products[i].ownerAddress == _address) {
            matchingProducts[index] = products[i];
            index++;
        }
    }

    return matchingProducts;

}


    //UPDATE
    function updatePrice(string memory _productID, uint256 _newPrice)
        public
        onlyOwner
    {
        Product[] storage product = productList[getContractOwner()];
        bool exist = false;
        for (uint256 i = 0; i < product.length; i++) {
            if (
                keccak256(bytes(product[i].productID)) ==
                keccak256(bytes(_productID))
            ) {
                product[i].price = _newPrice;
                exist = true;
                break;
            }
        }
        require(exist, "Product ID not exist");
    }

    //0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

    function updateSellerProductsOwned() public {
        Seller[] storage seller = sellerList[msg.sender];
            uint256 counter = 0;
            for (uint256 i = 0; i < seller.length; i++) {
                for (uint256 j = 0; j < productList[msg.sender].length; j++) {
                    if (productList[msg.sender][j].ownerAddress == seller[i].sellerAddress) {
                        counter++;
                    }
                }
                seller[i].productsOwned = counter;
                counter = 0;
            }
    }

    // DELETE
    function removeProductByID(string memory _productID) public onlyOwner {
        Product[] storage product = productList[getContractOwner()];
        bool exist = false;
        for (uint256 i = 0; i < product.length; i++) {
            if (
                keccak256(bytes(product[i].productID)) ==
                keccak256(bytes(_productID))
            ) {
                for (uint256 j = i; j < product.length - 1; j++) {
                    product[j] = product[j + 1];
                }
                product.pop();
                exist = true;
                break;
            }
        }
        require(exist, "Product ID not exist");
    }

    function removeSellerByID(string memory _sellerID) public onlyOwner{
        Seller[] storage seller = sellerList[getContractOwner()];
        bool exist = false;
        for(uint256 i=0;i<seller.length;i++){
            if (
                keccak256(bytes(seller[i].sellerID)) ==
                keccak256(bytes(_sellerID))
            ) {
                for (uint256 j = i; j < seller.length - 1; j++) {
                    seller[j] = seller[j + 1];
                 }
                seller.pop();
                exist = true;
                break;
            }
        }
        require(exist, "Seller ID not exist");
    }

    //SELL PRODUCT
    // function sellProductByID(string memory _productID, address payable _ownerAddress) public onlyOwner{
    //       Product[] storage product = productList[getContractOwner()];
    //     bool exist = false;
    //     for (uint256 i = 0; i < product.length; i++) {
    //         if (
    //             keccak256(bytes(product[i].productID)) ==
    //             keccak256(bytes(_productID))
    //         ) {
    //             product[i].sold = true;
    //             require(product[i].ownerAddress !=_ownerAddress, "Owner address cannot be the same.");
    //             product[i].ownerAddress = payable(_ownerAddress);
    //             exist = true;
    //             break;
    //         }
    //     }
    //     require(exist, "Product ID not exist");
    // }
     function allowanceSpending(address payable _owner, address payable _spender) public view returns (uint256) {
    return paymentToken.allowance(_owner, _spender);
    }
    // function transferToken(address  _from, address _to, uint256 amount) public returns (bool) {
    //     return paymentToken.transferFrom(_from, _to, amount);
    // }
    function sellProductByID(string memory _productID, address _ownerAddress) public {
        Product[] storage product = productList[getContractOwner()];
        bool exist = false;

        for (uint256 i = 0; i < product.length; i++) {
            if (keccak256(bytes(product[i].productID)) == keccak256(bytes(_productID))) {
                require(!product[i].sold, "Product already sold");
                require(product[i].ownerAddress != _ownerAddress, "Owner address cannot be the same.");
                require(paymentToken.balanceOf(payable(_ownerAddress)) >= product[i].price, "Insufficient balance");
           
                // Transfer the payment tokens from the buyer to the seller
                uint256 price = product[i].price;
                paymentToken.transferFrom(_ownerAddress, product[i].ownerAddress, price);
                
                product[i].sold = true;
                product[i].ownerAddress = payable(_ownerAddress);
                exist = true;
                break;
            }
        }
        require(exist, "Product ID does not exist");
    }
}
