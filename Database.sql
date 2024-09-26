#Database

## Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Shop Table

```sql
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, \\editor should handle
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## User Roles Table

```sql
CREATE TABLE shop_user_roles (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('owner', 'manager', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Suppliers Table

```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Products Table

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,  -- user who created/added the product
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('draft', 'published', 'unpublished')),
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100),
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    regular_price DECIMAL(10, 2),
    sale_price DECIMAL(10, 2),
    date_on_sale_from DATE,
    date_on_sale_to DATE,
    stock_status VARCHAR(50) CHECK (stock_status IN ('instock', 'outofstock')),
    stock_quantity INTEGER,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    categories TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product Images Table.

```sql
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);
```

## Product Suppliers Table

```sql
CREATE TABLE product_suppliers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
    quantity_supplied INTEGER NOT NULL,
    supplied_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Customers Table

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    customer_type VARCHAR(50) CHECK (customer_type IN ('online', 'in-store')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Purchases Table

```sql
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    total_amount DECIMAL(10, 2),
    payment_method VARCHAR(50) CHECK (payment_method IN ('credit_card', 'paypal', 'cash', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Purchase Items Table

```sql
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

///////// some table updated

## Suppliers Table

```sql
CREATE TABLE suppliers (
    supplierid SERIAL PRIMARY KEY,
    shopid INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    suppliername VARCHAR(255) NOT NULL,
    contactperson VARCHAR(255),
    address TEXT,
    phonenumber VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Products Table

```sql
CREATE TABLE products (
    productid SERIAL PRIMARY KEY,
    shopid INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    productname VARCHAR(255) NOT NULL,
    description TEXT,
    shortdescription TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    averagerating DECIMAL(3, 2) DEFAULT 0.00,
    ratingcount INTEGER DEFAULT 0,
    categories TEXT[],  -- Array for product categories
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product Types Table

```sql
CREATE TABLE product_types (
    producttypeid SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    shopid INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    producttype VARCHAR(50) NOT NULL CHECK (producttype IN ('single', 'variable')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product Supplier Entries Table

```sql
CREATE TABLE product_supplier_entries (
    entryid SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    supplierid INTEGER REFERENCES suppliers(supplierid) ON DELETE CASCADE,
    producttypeid INTEGER REFERENCES product_types(producttypeid) ON DELETE CASCADE,
    purchasedate DATE NOT NULL,
    purchaseunitprice DECIMAL(10, 2),  -- For single product purchases
    purchasequantity INTEGER,  -- For single product purchases
    supplyvariationid INTEGER[],  -- For variable products, stores variation IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Supply Variants Table

```sql
CREATE TABLE supply_variants (
    supplyvariationid SERIAL PRIMARY KEY,
    shopid INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    purchaseprice DECIMAL(10, 2),
    purchasequantity INTEGER,
    attributes JSONB,  -- Stores variation details like color and size
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product Prices Table

```sql
CREATE TABLE product_prices (
    priceid SERIAL PRIMARY KEY,
    shopid INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    unitprice DECIMAL(10, 2),  -- For single products
    saleprice DECIMAL(10, 2),  -- Discounted sale price
    dateonsalefrom DATE,
    dateonsaleto DATE,
    variationsprice INTEGER[],  -- List of productvariantid for variable product prices
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product Variations Table

```sql
CREATE TABLE product_variations (
    productvariantid SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    shopid INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    supplyvariationid INTEGER REFERENCES supply_variants(supplyvariationid) ON DELETE CASCADE,
    sku VARCHAR(100),  -- SKU for the specific variation
    price DECIMAL(10, 2),  -- Price for the variation
    sale_price DECIMAL(10, 2),  -- Sale price for the variation
    sale_price_start_date DATE,
    sale_price_end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product Images Table.

```sql
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);


# API List for Single Product Stock Management System
User APIs
POST /api/auth/signup
Sign up a new user.
POST /api/auth/login
Log in a user and create a session.
GET /api/users/:userId
Get user profile information.
Shop APIs
POST /api/shops
Create a new shop. Only owners can create a shop.
GET /api/shops
Get all shops owned or managed by a user.
GET /api/shops/:shopId
Get details of a specific shop.
POST /api/shops/:shopId/users
Assign roles (e.g., manager or staff) to users in the shop. Only owners can assign roles.
DELETE /api/shops/:shopId/users/:userId
Remove a user from the shop. Only owners and managers can remove users.
Product APIs
POST /api/shops/:shopId/products
Add a new product to a shop. (Owner, Manager)
GET /api/shops/:shopId/products
Get all products of a shop. (Owner, Manager, Staff)
GET /api/products/:productId
Get details of a specific product.
PATCH /api/products/:productId
Update a product’s details (e.g., price, stock, description). (Owner, Manager)
DELETE /api/products/:productId
Delete a product. (Owner, Manager)
Product Images APIs
POST /api/products/:productId/images
Add images to a product. (Owner, Manager)
GET /api/products/:productId/images
Get all images for a product. (Owner, Manager, Staff)
DELETE /api/products/:productId/images/:imageId
Delete an image from a product. (Owner, Manager)
Supplier APIs
POST /api/shops/:shopId/suppliers
Add a new supplier for the shop. (Owner, Manager)
GET /api/shops/:shopId/suppliers
Get all suppliers for a shop. (Owner, Manager, Staff)
GET /api/suppliers/:supplierId
Get details of a specific supplier.
PATCH /api/suppliers/:supplierId
Update supplier details. (Owner, Manager)
DELETE /api/suppliers/:supplierId
Remove a supplier. (Owner, Manager)
Stock Management APIs
POST /api/products/:productId/suppliers
Add supplier data for a product (link a supplier and quantity). (Owner, Manager)
GET /api/products/:productId/stock
Get stock status of a product. (Owner, Manager, Staff)
PATCH /api/products/:productId/stock
Update stock status (add or reduce stock). (Owner, Manager)

Customer APIs
POST /api/customers
Add a new customer. (Owner, Manager)
GET /api/customers
Get all customers of a shop. (Owner, Manager, Staff)
GET /api/customers/:customerId
Get details of a specific customer.
PATCH /api/customers/:customerId
Update customer details. (Owner, Manager)
DELETE /api/customers/:customerId
Remove a customer. (Owner, Manager)
Purchase APIs
POST /api/purchases
Record a new purchase. (Owner, Manager, Staff)
GET /api/purchases
Get all purchases for a shop or customer. (Owner, Manager, Staff)
GET /api/purchases/:purchaseId
Get details of a specific purchase.
PATCH /api/purchases/:purchaseId
Update purchase details. (Owner, Manager)
DELETE /api/purchases/:purchaseId
Delete a purchase. (Owner, Manager)
Purchase Items APIs
POST /api/purchases/:purchaseId/items
Add items to a purchase. (Owner, Manager, Staff)
GET /api/purchases/:purchaseId/items
Get all items of a specific purchase.
PATCH /api/purchases/:purchaseId/items/:itemId
Update item details in a purchase. (Owner, Manager)
DELETE /api/purchases/:purchaseId/items/:itemId
Remove an item from a purchase. (Owner, Manager)



# Flow Chart

Flowchart for Stock Management System
The flowchart focuses on how the system handles the creation of shops, users, products, and stock management, while assigning roles within shops and managing supplier relationships.

Flowchart Key Steps:
User Sign Up/Login

User signs up or logs in to the system.
If the user is the owner, they can create shops.
Shop Management

The owner creates a shop.
The owner can assign users to the shop and give them roles (e.g., manager, staff).
Product Management

Products are created by the owner or manager of the shop.
They are stored with details like SKU, price, stock, etc.
Each product is linked to a shop and a supplier.
Supplier Management

Shops add suppliers to track stock and product sourcing.
Each product can have one or more suppliers.
Stock Management

Owners or managers can track and update stock levels for each product.
Stock is managed per product per shop.

Flowchart Overview for Customer and Purchase Management
Customer Management

Add Customer: Shop Owner/Manager adds customer details (online or in-store).
Update Customer: Modify customer information as needed.
Remove Customer: Delete customer records if necessary.
Purchase Management

Record Purchase: Owner/Manager/Staff records a new purchase, linking it to a customer and shop.
Add Purchase Items: Add details of each product purchased.
Update Purchase: Modify purchase details, including item quantities and prices.
View Purchases: Retrieve and display all purchases for a shop or customer.
Purchase Items Management

Add Purchase Items: Record individual products included in a purchase.
Update Purchase Items: Modify details of products within a purchase.
Remove Purchase Items: Remove products from a purchase if necessary.