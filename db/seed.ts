import { getDb } from "../api/queries/connection";
import { branches, categories, products, branchProducts, users, orders, orderItems } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed branches
  const branchData = [
    { name: "Arocena", address: "Mercado Arocena, Av. Alfredo Arocena 1806", phone: "+598 99 123 456", openingHours: { lunes: "12:00 a 16:00 y 19:00 a 23:30", martes: "12:00 a 16:00 y 19:00 a 23:30", miercoles: "12:00 a 16:00 y 19:00 a 23:30", jueves: "12:00 a 16:00 y 19:00 a 23:30", viernes: "12:00 a 00:00", sabado: "12:00 a 00:00", domingo: "12:00 a 23:30" } },
    { name: "Car One", address: "Car One, Cam. de Los Horneros", phone: "+598 99 234 567", openingHours: { lunes: "12:00 a 19:00", martes: "12:00 a 19:00", miercoles: "12:00 a 19:00", jueves: "12:00 a 19:00", viernes: "12:00 a 19:00", sabado: "12:00 a 19:00", domingo: "12:00 a 19:00" } },
    { name: "Ferrando", address: "Mercado Ferrando, Chaná 2120", phone: "+598 99 345 678", openingHours: { lunes: "12:00 a 00:00", martes: "12:00 a 00:00", miercoles: "12:00 a 00:00", jueves: "12:00 a 00:00", viernes: "12:00 a 01:00", sabado: "12:00 a 01:00", domingo: "12:00 a 00:00" } },
    { name: "Prado", address: "Mercado del Prado, Joaquín Suárez 3217", phone: "+598 99 456 789", openingHours: { lunes: "12:00 a 00:00", martes: "12:00 a 00:00", miercoles: "12:00 a 00:00", jueves: "12:00 a 01:00", viernes: "12:00 a 01:00", sabado: "12:00 a 01:00", domingo: "12:00 a 00:00" } },
    { name: "Tres Cruces", address: "Shopping Terminal, Bv. Gral. Artigas 1825", phone: "+598 99 567 890", openingHours: { lunes: "09:00 a 23:00", martes: "09:00 a 23:00", miercoles: "09:00 a 23:00", jueves: "09:00 a 23:00", viernes: "09:00 a 24:00", sabado: "09:00 a 23:00", domingo: "09:00 a 23:00" } },
    { name: "Williman", address: "Mercado Williman, Claudio Williman 626", phone: "+598 99 678 901", openingHours: { lunes: "12:00 a 16:00 y 19:00 a 00:00", martes: "12:00 a 16:00 y 19:00 a 00:00", miercoles: "12:00 a 16:00 y 19:00 a 00:00", jueves: "12:00 a 16:00 y 19:00 a 00:00", viernes: "12:00 a 00:00", sabado: "12:00 a 00:00", domingo: "12:00 a 00:00" } },
    { name: "MAM", address: "Mercado Agrícola, José L. Terra 2220", phone: "+598 99 789 012", openingHours: { lunes: "11:00 a 23:00", martes: "11:00 a 23:00", miercoles: "11:00 a 23:00", jueves: "11:00 a 23:00", viernes: "11:00 a 23:00", sabado: "11:00 a 23:00", domingo: "11:00 a 23:00" } },
    { name: "El Pinar", address: "Ciudad de la Costa, Av. Perez Butler M249 S2", phone: "+598 99 890 123", openingHours: { lunes: "14:00 a 22:00", martes: "14:00 a 22:00", miercoles: "13:00 a 22:00", jueves: "13:00 a 22:00", viernes: "14:00 a 24:00", sabado: "14:00 a 24:00", domingo: "12:00 a 22:00" } },
    { name: "Minas", address: "Punto Minas, Ruta 8 esquina 18 de julio", phone: "+598 99 901 234", openingHours: { lunes: "08:00 a 22:00", martes: "08:00 a 22:00", miercoles: "08:00 a 22:00", jueves: "08:00 a 22:00", viernes: "08:00 a 22:00", sabado: "08:00 a 22:00", domingo: "08:00 a 22:00" } },
  ];

  for (const b of branchData) {
    await db.insert(branches).values(b);
  }
  console.log("Branches seeded");

  // Seed categories
  const categoryData = [
    { name: "Helados", slug: "helados", icon: "IceCream" },
    { name: "Paletas", slug: "paletas", icon: "Candy" },
    { name: "Cucuruchos", slug: "cucuruchos", icon: "Cone" },
    { name: "Vasos", slug: "vasos", icon: "CupSoda" },
  ];
  for (const c of categoryData) {
    await db.insert(categories).values(c);
  }
  console.log("Categories seeded");

  // Seed products
  const heladosCategoryId = 1;
  const paletasCategoryId = 2;

  const productData = [
    { name: "Dulce de Leche", description: "Nuestro clásico irresistible. Helado de dulce de leche con generosas cintas de caramelo.", categoryId: heladosCategoryId, image: "/flavors/dulce-de-leche.jpg", basePrice: "120", priceHalfKg: "200", priceOneKg: "350", priceCone: "80", priceCup: "90", isPopsicle: false, maxFlavors: 2, tags: ["Clasico", "Crema"], isAvailable: true },
    { name: "Chocolate", description: "Intenso y cremoso. Chocolate belga en su máxima expresión.", categoryId: heladosCategoryId, image: "/flavors/chocolate.jpg", basePrice: "120", priceHalfKg: "200", priceOneKg: "350", priceCone: "80", priceCup: "90", isPopsicle: false, maxFlavors: 2, tags: ["Clasico", "Chocolate"], isAvailable: true },
    { name: "Frutilla", description: "Helado de frutilla con trozos de fruta fresca. Refrescante y natural.", categoryId: heladosCategoryId, image: "/flavors/frutilla.jpg", basePrice: "110", priceHalfKg: "180", priceOneKg: "320", priceCone: "70", priceCup: "80", isPopsicle: false, maxFlavors: 2, tags: ["Frutal", "Fresa"], isAvailable: true },
    { name: "Menta Granizada", description: "Fresca menta con chips de chocolate negro. El equilibrio perfecto.", categoryId: heladosCategoryId, image: "/flavors/menta-granizada.jpg", basePrice: "120", priceHalfKg: "200", priceOneKg: "350", priceCone: "80", priceCup: "90", isPopsicle: false, maxFlavors: 2, tags: ["Clasico", "Chips"], isAvailable: true },
    { name: "Crema Americana", description: "La pureza del sabor. Nuestra receta tradicional de crema más suave.", categoryId: heladosCategoryId, image: "/flavors/crema-americana.jpg", basePrice: "110", priceHalfKg: "180", priceOneKg: "320", priceCone: "70", priceCup: "80", isPopsicle: false, maxFlavors: 2, tags: ["Clasico", "Crema"], isAvailable: true },
    { name: "Banana Split", description: "Plátano con trocitos de fruta, chocolate y un toque de vainilla.", categoryId: heladosCategoryId, image: "/flavors/banana-split.jpg", basePrice: "130", priceHalfKg: "220", priceOneKg: "380", priceCone: "85", priceCup: "95", isPopsicle: false, maxFlavors: 2, tags: ["Especial", "Frutal"], isAvailable: true },
    { name: "Limon", description: "Sorbete de limón natural. Ácido, refrescante y adictivo.", categoryId: heladosCategoryId, image: "/flavors/limon.jpg", basePrice: "100", priceHalfKg: "160", priceOneKg: "280", priceCone: "65", priceCup: "75", isPopsicle: false, maxFlavors: 2, tags: ["Frutal", "Sorbete"], isAvailable: true },
    { name: "Maracuya", description: "Sorbete de maracuyá con semillas reales. Un viaje tropical.", categoryId: heladosCategoryId, image: "/flavors/maracuya.jpg", basePrice: "100", priceHalfKg: "160", priceOneKg: "280", priceCone: "65", priceCup: "75", isPopsicle: false, maxFlavors: 2, tags: ["Frutal", "Sorbete"], isAvailable: true },
    { name: "Tramontana", description: "Crema con masa de galleta y caramelo. Inspirado en los mejores postres.", categoryId: heladosCategoryId, image: "/flavors/tramontana.jpg", basePrice: "130", priceHalfKg: "220", priceOneKg: "380", priceCone: "85", priceCup: "95", isPopsicle: false, maxFlavors: 2, tags: ["Especial", "Galleta"], isAvailable: true },
    { name: "Cookies & Cream", description: "Crema con trozos de galleta Oreo. Crujiente y cremoso a la vez.", categoryId: heladosCategoryId, image: "/flavors/cookies-cream.jpg", basePrice: "130", priceHalfKg: "220", priceOneKg: "380", priceCone: "85", priceCup: "95", isPopsicle: false, maxFlavors: 2, tags: ["Especial", "Galleta"], isAvailable: true },
    { name: "Chocolate Blanco", description: "Suave y delicado. Chocolate blanco suizo en cada cucharada.", categoryId: heladosCategoryId, image: "/flavors/chocolate-blanco.jpg", basePrice: "120", priceHalfKg: "200", priceOneKg: "350", priceCone: "80", priceCup: "90", isPopsicle: false, maxFlavors: 2, tags: ["Chocolate", "Especial"], isAvailable: true },
    { name: "Pistacho", description: "Helado de pistacho italiano con trozos de pistacho siciliano.", categoryId: heladosCategoryId, image: "/flavors/pistacho.jpg", basePrice: "140", priceHalfKg: "240", priceOneKg: "400", priceCone: "90", priceCup: "100", isPopsicle: false, maxFlavors: 2, tags: ["Premium", "Frutos Secos"], isAvailable: true },
    { name: "Cafe", description: "Helado de café espresso. Para los amantes del buen café.", categoryId: heladosCategoryId, image: "/flavors/cafe.jpg", basePrice: "120", priceHalfKg: "200", priceOneKg: "350", priceCone: "80", priceCup: "90", isPopsicle: false, maxFlavors: 2, tags: ["Clasico", "Cafe"], isAvailable: true },
    { name: "Nocciola", description: "Avellana tostada en su forma más cremosa. Sabor italiano auténtico.", categoryId: heladosCategoryId, image: "/flavors/nocciola.jpg", basePrice: "130", priceHalfKg: "220", priceOneKg: "380", priceCone: "85", priceCup: "95", isPopsicle: false, maxFlavors: 2, tags: ["Premium", "Frutos Secos"], isAvailable: true },
    { name: "Coco", description: "Helado de coco con coco rallado. Un sabor tropical en cada bocado.", categoryId: heladosCategoryId, image: "/flavors/coco.jpg", basePrice: "110", priceHalfKg: "180", priceOneKg: "320", priceCone: "70", priceCup: "80", isPopsicle: false, maxFlavors: 2, tags: ["Tropical", "Frutal"], isAvailable: true },
    // Paletas
    { name: "Paleta Fresa", description: "Paleta en forma de corazón con frutilla natural. Auténtica paleta mexicana.", categoryId: paletasCategoryId, image: "/flavors/paleta-fresa.jpg", basePrice: "90", priceHalfKg: null, priceOneKg: null, priceCone: null, priceCup: null, isPopsicle: true, maxFlavors: 1, tags: ["Paleta", "Frutal"], isAvailable: true },
    { name: "Paleta Mango", description: "Paleta de mango con forma de carita. Dulce y tropical.", categoryId: paletasCategoryId, image: "/flavors/paleta-mango.jpg", basePrice: "90", priceHalfKg: null, priceOneKg: null, priceCone: null, priceCup: null, isPopsicle: true, maxFlavors: 1, tags: ["Paleta", "Frutal"], isAvailable: true },
    { name: "Paleta Limon", description: "Paleta de limón helado. Refrescante y ácida.", categoryId: paletasCategoryId, image: "/flavors/paleta-limon.jpg", basePrice: "80", priceHalfKg: null, priceOneKg: null, priceCone: null, priceCup: null, isPopsicle: true, maxFlavors: 1, tags: ["Paleta", "Frutal"], isAvailable: true },
    { name: "Paleta Oreo", description: "Paleta de crema bañada en chocolate con galleta Oreo. Irresistible.", categoryId: paletasCategoryId, image: "/flavors/paleta-oreo.jpg", basePrice: "100", priceHalfKg: null, priceOneKg: null, priceCone: null, priceCup: null, isPopsicle: true, maxFlavors: 1, tags: ["Paleta", "Chocolate"], isAvailable: true },
    { name: "Paleta Dulce de Leche", description: "Paleta de dulce de leche con cobertura de chocolate. Un clásico reinventado.", categoryId: paletasCategoryId, image: "/flavors/paleta-dulce-de-leche.jpg", basePrice: "100", priceHalfKg: null, priceOneKg: null, priceCone: null, priceCup: null, isPopsicle: true, maxFlavors: 1, tags: ["Paleta", "Clasico"], isAvailable: true },
  ];

  for (const p of productData) {
    await db.insert(products).values(p);
  }
  console.log("Products seeded");

  // Seed branchProducts (all products available at all branches)
  const allBranches = await db.select().from(branches);
  const allProducts = await db.select().from(products);

  for (const b of allBranches) {
    for (const p of allProducts) {
      await db.insert(branchProducts).values({
        branchId: b.id,
        productId: p.id,
        isAvailable: true,
      });
    }
  }
  console.log("Branch products seeded");

  // Seed mock users (with bcrypt-hashed passwords for 'password123')
  // Password hash for 'password123'
  const adminPassword = "$2a$10$YourHashHere"; // Will be handled by auth
  const clientPassword = "$2a$10$YourHashHere";

  await db.insert(users).values({
    unionId: "admin_chelato",
    name: "Admin Chelato",
    email: "admin@chelato.com.uy",
    role: "admin",
    password: null, // OAuth only for demo
  });

  await db.insert(users).values({
    unionId: "client_demo",
    name: "Juan Pérez",
    email: "juan@email.com",
    role: "user",
    password: null,
  });
  console.log("Users seeded");

  console.log("Seeding complete!");
}

seed().catch(console.error);
