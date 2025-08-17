"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { ProductForm } from "@/components/product-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  User,
  Heart,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  similarity?: number;
}

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (data.products) {
        // Transform the products to match our interface
        const formattedProducts = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl || "",
        }));

        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle product search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setActiveTab("search");

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm"
      >
        {/* Top bar with logo, account, cart */}
        <div className="border-b py-2 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto flex items-center justify-between">
            {/* Left - Mobile menu */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Center/Left - Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AI Shop
              </h1>
            </motion.div>

            {/* Center - Categories (desktop only) */}
            <div className="hidden md:flex items-center gap-6 mx-4">
              {[
                "Electronics",
                "Home & Living",
                "Fashion",
                "Beauty",
                "Sports",
              ].map((category) => (
                <motion.div
                  key={category}
                  className="relative group"
                  whileHover={{ y: -2 }}
                >
                  <button className="text-sm font-medium flex items-center gap-1 py-1">
                    {category}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                  <motion.div
                    className="h-0.5 w-0 bg-primary absolute bottom-0 left-0 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Right - Account & Cart */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden md:flex"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {Math.floor(Math.random() * 5)}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="py-4 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 py-8">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Hero Banner */}
          <motion.div
            className="mb-10 rounded-xl overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-64 md:h-80 flex items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://img.freepik.com/premium-vector/e-commerce-online-shopping-flat-illustration-suitable-web-banners_210682-45.jpg')] bg-cover bg-center opacity-10"></div>
              <div className="container mx-auto px-6 md:px-10 z-1">
                <div className="max-w-lg">
                  <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Discover Products with{" "}
                    <span className="text-primary">AI-Powered</span> Search
                  </motion.h2>
                  <motion.p
                    className="text-muted-foreground mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Find exactly what you're looking for with our semantic
                    search technology
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button size="lg" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Explore Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              "All Products",
              "Electronics",
              "Home & Living",
              "Fashion",
              "Beauty",
              "Sports",
              "Toys",
            ].map((category, i) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Button
                  variant={category === "All Products" ? "default" : "outline"}
                  className="rounded-full px-4 py-2 h-auto text-sm"
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
              value={activeTab}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="bg-background/80 backdrop-blur-sm border">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All Products
                  </TabsTrigger>
                  <TabsTrigger
                    value="search"
                    disabled={searchResults.length === 0}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Search Results
                  </TabsTrigger>
                </TabsList>

                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-plus"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                        Add Product
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <ProductForm onSuccess={fetchProducts} />
                  </DialogContent>
                </Dialog>
              </div>

              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 flex flex-col items-center gap-4"
                  >
                    <div className="relative w-16 h-16">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary/30"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <p className="text-lg font-medium">Loading products...</p>
                  </motion.div>
                ) : products.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                  >
                    {products.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 border rounded-lg bg-background/50 backdrop-blur-sm"
                  >
                    <p className="text-lg text-muted-foreground">
                      No products found. Add your first product!
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4"
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-plus"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                            Add First Product
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <ProductForm onSuccess={fetchProducts} />
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 flex flex-col items-center gap-4"
                  >
                    <div className="relative w-16 h-16">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary/30"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <p className="text-lg font-medium">Searching with AI...</p>
                  </motion.div>
                ) : searchResults.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-muted-foreground mb-6 bg-muted/50 py-2 px-4 rounded-full inline-block"
                    >
                      <span className="font-medium text-foreground">
                        Found {searchResults.length} results
                      </span>{" "}
                      for "{searchQuery}"
                    </motion.p>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {searchResults.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          showSimilarity
                          index={index}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 border rounded-lg bg-background/50 backdrop-blur-sm"
                  >
                    <p className="text-lg text-muted-foreground">
                      No results found for "{searchQuery}"
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try a different search term or browse all products
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-auto py-8 text-center text-sm border-t bg-background/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          {/* <p className="text-muted-foreground">
            AI Product Search Demo using{" "}
            <span className="font-medium text-primary">Supabase Vector DB</span>{" "}
            and <span className="font-medium text-primary">LangChain</span>
          </p> */}
          <p className="text-xs text-muted-foreground/70 mt-1">
            © {new Date().getFullYear()} • Built with Love
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
