"use client";

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent } from '@mui/material';
import { firestore } from '@/firebase';
import {
  collection, doc, getDocs, query, setDoc, deleteDoc, getDoc,
} from 'firebase/firestore';

const modalStyle = {
  position: 'absolute',
  top: '15%',
  left: '5%',
  transform: 'translateY(-50%)',
  width: 400,
  bgcolor: 'rgba(255, 255, 255, 0.8)', // Slight transparency for the modal
  borderRadius: 8,
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on the search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{
        backgroundColor: '#C8E6C9', // Light green background
        backgroundImage: 'url(/path/to/pattern.svg)', // Placeholder for a nature-inspired pattern
        backgroundSize: 'cover',
        padding: 4,
      }}
    >
      <Box
        sx={{
          marginLeft: '2%',
          marginTop: '1%',
          padding: 3,
          borderRadius: 3,
          backgroundColor: 'rgba(56, 142, 60, 0.5)', // Matching transparent green background
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: '300', color: '#F1F8E9', marginBottom: 1 }}>
          Inventory Management
        </Typography>
        <Typography variant="h5" sx={{ color: '#E8F5E9' }}>
          Manage your inventory effortlessly with this simple and intuitive app. Add, search, and track items with ease.
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: 'rgba(56, 142, 60, 0.4)', // Increased transparency for the box
          borderRadius: 3,
          padding: 4,
          width: '85%', // Expanded width to take up more space
          height: 'auto',
          minHeight: '60vh', // Reduced height for a shorter bottom
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
          marginTop: '2%',
          marginBottom: '2%', // Matching top and bottom margins
          marginLeft: '2%',
        }}
      >
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            marginBottom: 3,
            bgcolor: '#A5D6A7',
            borderRadius: 3,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        />

        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#43A047', // Brighter green for better visibility
            color: 'white',
            fontWeight: 'bold',
            paddingX: 4,
            paddingY: 1.5, // Smaller padding for a smaller button
            borderRadius: 3,
            fontSize: '1rem', // Slightly smaller font size
            boxShadow: '0px 4px 12px rgba(0, 128, 0, 0.5)',
            '&:hover': {
              backgroundColor: '#388E3C',
              boxShadow: '0px 6px 16px rgba(0, 128, 0, 0.7)',
            },
            marginBottom: 4,
          }}
        >
          Add New Item
        </Button>

        <Stack
          width="100%"
          maxHeight="40vh" // Adjusted height to fit the shorter box
          spacing={2}
          overflow="auto"
          sx={{
            backgroundColor: 'transparent',
            borderRadius: 3,
            padding: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f0f0f0',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#81C784',
              borderRadius: '20px',
            },
          }}
        >
          {filteredInventory.map(({ name, quantity }) => {
            if (typeof quantity !== 'number' || isNaN(quantity)) return null;
            return (
              <Card
                key={name}
                sx={{
                  minWidth: '100%',
                  borderRadius: 3,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)', // Slight transparency for item cards
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#1B5E20', // Darker green for better contrast
                  }}
                >
                  <Typography variant="h5">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6">
                    Quantity: {quantity}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(name)}
                    sx={{
                      transition: 'background-color 0.3s ease',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#b71c1c',
                      },
                    }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
