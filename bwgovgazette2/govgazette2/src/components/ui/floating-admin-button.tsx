import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingAdminButton() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={() => navigate('/admin/login')}
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        size="icon"
      >
        <Settings className="h-6 w-6" />
      </Button>
      
      {/* Tooltip */}
      <motion.div
        className="absolute bottom-16 right-0 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-md text-sm whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        Admin Login
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
      </motion.div>
    </motion.div>
  );
}