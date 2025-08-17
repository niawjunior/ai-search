import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative flex w-full"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`relative w-full rounded-lg ${
          isFocused ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        animate={{
          boxShadow: isFocused ? "0 0 0 2px rgba(var(--primary), 0.3)" : "none",
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
          initial={{ scale: 1 }}
          animate={{
            rotate: [0, 360],
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 2, ease: "linear" },
            scale: { duration: 0.2 },
          }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <Input
          placeholder="Search products with AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-24 py-6 text-base border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </motion.div>
      <motion.div
        className="absolute right-0 top-0 h-full"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          type="submit"
          className="h-full rounded-l-none px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <Search className="h-4 w-4" />
              </motion.div>
              <span>Searching...</span>
            </motion.div>
          ) : (
            <motion.div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </motion.div>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
