import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  similarity?: number;
  relevanceScore?: number;
  debug?: {
    relevancePercentage: string;
  };
}

interface ProductCardProps {
  product: Product;
  showSimilarity?: boolean;
  index?: number;
}

export function ProductCard({
  product,
  showSimilarity = false,
  index = 0,
}: ProductCardProps) {
  // Generate a random price for demo purposes
  //   const price = Math.floor(Math.random() * 90) + 10 + 0.99;
  // Generate random rating for demo purposes
  const rating = (Math.random() * 2 + 3).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full py-0 flex flex-col border hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md">
        <div className="relative">
          {/* Wishlist button */}
          <motion.div
            className="absolute top-2 right-2 z-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-background/80 backdrop-blur-sm h-8 w-8"
            >
              <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
            </Button>
          </motion.div>

          {/* Sale tag */}
          {index % 3 === 0 && (
            <div className="absolute top-2 left-2 z-1">
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1">
                SALE
              </Badge>
            </div>
          )}

          {/* Product image */}
          <div className="aspect-square relative overflow-hidden">
            {product.imageUrl ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
        </div>

        <CardHeader className="pb-0 pt-3">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              {/* Category tag */}
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {index % 2 === 0 ? "Electronics" : "Home & Living"}
              </div>

              {/* Product name */}
              <CardTitle className="text-base font-bold line-clamp-1">
                {product.name}
              </CardTitle>

              {/* Rating stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(Number(rating))
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {rating} ({Math.floor(Math.random() * 100) + 5})
                </span>
              </div>
            </div>

            {/* Relevance score badge */}
            {showSimilarity && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  product.relevanceScore && product.relevanceScore > 80
                    ? "bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                    : product.relevanceScore && product.relevanceScore > 60
                    ? "bg-primary/20 hover:bg-primary/30 border-primary/50"
                    : "bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/50"
                }`}
              >
                {product.relevanceScore
                  ? `${product.relevanceScore}% match`
                  : product.similarity
                  ? `${Math.round(product.similarity * 100)}% match`
                  : "Match"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="py-1">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>

          {/* Price section */}
          {/* <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
            {index % 4 === 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${(price * 1.2).toFixed(2)}
              </span>
            )}
          </div> */}
        </CardContent>

        <CardFooter className="pt-0 pb-3 gap-2">
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
