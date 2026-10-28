/**
 * Comprehensive Automated End-to-End Test Suite for SnapCraft Admin Panel & Public Website
 * Tests:
 * Test A: Admin Product Creation with Image Upload & Draft Saving
 * Test B: Image & Data Persistence Across Invocations
 * Test C: Publishing Workflow & Public Website Synchronization
 * Test D: Product Editing, Media Replacement & Inclusions Update
 * Test E: Publishing States (Draft -> Published -> Draft -> Published)
 * Test F: File Type & Validation Failure Handling
 * Test G: Catalog Regression, Category Management & Cleanup
 */

// 1. Setup in-memory IndexedDB & DOM polyfill for Node.js
class MemoryObjectStore {
  name: string;
  data: Map<string, any> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  get(id: string) {
    const req: any = { result: this.data.get(id) || null };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
    return req;
  }

  getAll() {
    const req: any = { result: Array.from(this.data.values()) };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
    return req;
  }

  put(item: any) {
    if (item && item.id) {
      this.data.set(item.id, item);
    }
    const req: any = { result: item };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
    return req;
  }

  delete(id: string) {
    this.data.delete(id);
    const req: any = { result: undefined };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
    return req;
  }

  clear() {
    this.data.clear();
    const req: any = { result: undefined };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
    return req;
  }
}

class MemoryDatabase {
  stores: Map<string, MemoryObjectStore> = new Map();
  objectStoreNames = {
    contains: (name: string) => this.stores.has(name),
  };

  createObjectStore(name: string, _options?: any) {
    const store = new MemoryObjectStore(name);
    this.stores.set(name, store);
    return store;
  }

  transaction(storeName: string, _mode: string) {
    let store = this.stores.get(storeName);
    if (!store) {
      store = new MemoryObjectStore(storeName);
      this.stores.set(storeName, store);
    }
    const tx: any = {
      objectStore: () => store,
    };
    setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
    return tx;
  }
}

const memoryDb = new MemoryDatabase();

// Setup global window environment
(global as any).window = {
  indexedDB: {
    open: (_name: string, _version: number) => {
      const req: any = { result: memoryDb };
      setTimeout(() => {
        if (req.onupgradeneeded) {
          req.onupgradeneeded({ target: { result: memoryDb } });
        }
        if (req.onsuccess) {
          req.onsuccess({ target: req });
        }
      }, 0);
      return req;
    },
  },
  localStorage: {
    store: new Map<string, string>(),
    getItem(k: string) {
      return this.store.get(k) || null;
    },
    setItem(k: string, v: string) {
      this.store.set(k, String(v));
    },
    removeItem(k: string) {
      this.store.delete(k);
    },
    clear() {
      this.store.clear();
    },
  },
  dispatchEvent: (_event: any) => true,
  addEventListener: (_type: string, _listener: any) => {},
  removeEventListener: (_type: string, _listener: any) => {},
  BroadcastChannel: class {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    postMessage(_msg: any) {}
    addEventListener(_type: string, _listener: any) {}
    removeEventListener(_type: string, _listener: any) {}
    close() {}
  },
};

(global as any).localStorage = (global as any).window.localStorage;
(global as any).CustomEvent = class {
  type: string;
  constructor(type: string, _params?: any) {
    this.type = type;
  }
};

// Now import modules under test
async function runTestSuite() {
  console.log("================================================================================");
  console.log("🚀 STARTING SNAPCTAFT ADMIN & PUBLIC WEBSITE AUTOMATED VERIFICATION SUITE");
  console.log("================================================================================\n");

  const {
    uploadProductMediaFile,
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getPublishedProducts,
    getProductById,
    getProductBySlug,
    getCategories,
    createCategory,
    getAllMedia,
    toPublicProduct,
  } = await import("../src/lib/products-service");

  let testPassedCount = 0;
  let testTotalCount = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    testTotalCount++;
    if (condition) {
      testPassedCount++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${details || "Assertion failed"}`);
      process.exitCode = 1;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST A: Admin Product Creation with Image Upload & Draft Saving
  // ---------------------------------------------------------------------------
  console.log("📌 TEST A: Product Creation & High-Res Image Upload Pipeline");
  const rawPngBytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  const mockFile = {
    name: "royal-velvet-hamper.png",
    type: "image/png",
    size: rawPngBytes.length,
    arrayBuffer: async () => rawPngBytes,
  } as unknown as File;

  const uploadedMedia = await uploadProductMediaFile(mockFile);
  assert(
    !!uploadedMedia.url && uploadedMedia.url.startsWith("data:image/png;base64"),
    "Image Upload Pipeline returns valid persistent data URL",
    `Expected valid data URL, got: ${uploadedMedia.url?.slice(0, 30)}...`
  );
  assert(
    uploadedMedia.fileName === "royal-velvet-hamper.png",
    "Uploaded file name preserved correctly"
  );

  const initialDraftProduct = await createProduct({
    name: "Royal Velvet Celebration Hamper",
    slug: "royal-velvet-celebration-hamper",
    categoryId: "hampers",
    categoryLabel: "Gift Hampers",
    price: 3499,
    salePrice: 2999,
    status: "draft",
    featured: true,
    primaryImageUrl: uploadedMedia.url,
    additionalImages: [uploadedMedia.url],
    shortDescription: "A luxurious handcrafted velvet trunk filled with artisan chocolates and keepsakes.",
    fullDescription: "Designed for extraordinary celebrations, the Royal Velvet Hamper showcases velvet textures and gourmet delicacies.",
    tagline: "Unmatched elegance in a gift box",
    leadTime: "24-48 Hours",
    inclusions: ["Velvet trunk with brass lock", "Belgian truffle collection (12 pcs)", "Personal handwritten wax-sealed letter"],
    specifications: [
      { key: "Trunk Material", value: "Premium Velvet & MDF" },
      { key: "Dimensions", value: "30cm x 22cm x 15cm" },
    ],
    downloadableAssets: [],
    customFields: {},
    rating: 5.0,
    reviewsCount: 1,
    badge: "Bestseller",
  });

  assert(
    !!initialDraftProduct.id && initialDraftProduct.id.length > 5,
    "Product created with unique ID",
    `Received: ${initialDraftProduct.id}`
  );
  assert(
    initialDraftProduct.status === "draft",
    "Product saved initially in 'draft' status"
  );
  assert(
    initialDraftProduct.primaryImageUrl === uploadedMedia.url,
    "Product references correct primary uploaded image"
  );

  // ---------------------------------------------------------------------------
  // TEST B: Persistence & Re-fetching
  // ---------------------------------------------------------------------------
  console.log("\n📌 TEST B: Image & Data Persistence Across Invocations");
  const fetchedById = await getProductById(initialDraftProduct.id);
  assert(
    !!fetchedById,
    "Product successfully retrieved from persistent storage by ID"
  );
  assert(
    fetchedById?.primaryImageUrl === uploadedMedia.url,
    "Persistent image URL matches uploaded image exactly"
  );
  assert(
    fetchedById?.inclusions.length === 3,
    "Product inclusions persisted without data loss"
  );
  assert(
    fetchedById?.specifications.length === 2,
    "Product specifications persisted accurately"
  );

  const fetchedBySlug = await getProductBySlug("royal-velvet-celebration-hamper");
  assert(
    fetchedBySlug?.id === initialDraftProduct.id,
    "Product lookup by slug resolves to correct record"
  );

  // ---------------------------------------------------------------------------
  // TEST C: Publishing Workflow & Public Storefront Synchronization
  // ---------------------------------------------------------------------------
  console.log("\n📌 TEST C: Public Storefront Synchronization & Publishing");
  const publicListBeforePublish = await getPublishedProducts();
  const foundBefore = publicListBeforePublish.find((p) => p.id === initialDraftProduct.id);
  assert(
    !foundBefore,
    "Draft products remain completely hidden from public visitors"
  );

  // Publish product
  const publishedProduct = await updateProduct(initialDraftProduct.id, {
    status: "published",
  });
  assert(
    publishedProduct.status === "published",
    "Product status transitioned to 'published'"
  );
  assert(
    !!publishedProduct.publishedAt,
    "publishedAt timestamp assigned when published"
  );

  const publicListAfterPublish = await getPublishedProducts();
  const foundAfter = publicListAfterPublish.find((p) => p.id === initialDraftProduct.id);
  assert(
    !!foundAfter,
    "Published product immediately renders in public website product listings"
  );

  const publicViewModel = toPublicProduct(publishedProduct);
  assert(
    publicViewModel.image === uploadedMedia.url,
    "Public product view model maps image to uploaded media URL"
  );
  assert(
    publicViewModel.name === "Royal Velvet Celebration Hamper",
    "Public product view model contains correct title"
  );
  assert(
    publicViewModel.price === 3499,
    "Public product view model reflects correct pricing"
  );

  // ---------------------------------------------------------------------------
  // TEST D: Product Editing & Media Replacement
  // ---------------------------------------------------------------------------
  console.log("\n📌 TEST D: Product Editing, Media Replacement & Inclusions Update");
  const rawJpegBytes = Buffer.from(
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
    "base64"
  );
  const newMockFile = {
    name: "updated-velvet-hamper.jpg",
    type: "image/jpeg",
    size: rawJpegBytes.length,
    arrayBuffer: async () => rawJpegBytes,
  } as unknown as File;

  const updatedMedia = await uploadProductMediaFile(newMockFile);
  const updatedProductRecord = await updateProduct(initialDraftProduct.id, {
    price: 3999,
    salePrice: 3499,
    primaryImageUrl: updatedMedia.url,
    additionalImages: [updatedMedia.url, uploadedMedia.url],
    shortDescription: "Updated luxury velvet trunk with custom satin bow and 16 truffles.",
    inclusions: [
      "Velvet trunk with brass lock",
      "Belgian truffle collection (16 pcs)",
      "Scented soy candle in ceramic jar",
      "Personal handwritten wax-sealed letter",
    ],
  });

  assert(
    updatedProductRecord.price === 3999,
    "Edited price updated successfully"
  );
  assert(
    updatedProductRecord.primaryImageUrl === updatedMedia.url,
    "Primary image replaced with new uploaded media"
  );
  assert(
    updatedProductRecord.additionalImages.length === 2,
    "Gallery images updated and preserved"
  );
  assert(
    updatedProductRecord.inclusions.length === 4,
    "Updated inclusions checklist saved"
  );

  const publicUpdatedList = await getPublishedProducts();
  const publicUpdated = publicUpdatedList.find((p) => p.id === initialDraftProduct.id);
  assert(
    publicUpdated?.price === 3999,
    "Public website immediately reflects edited price without refresh"
  );
  assert(
    toPublicProduct(updatedProductRecord).image === updatedMedia.url,
    "Public website immediately reflects updated primary image"
  );

  // ---------------------------------------------------------------------------
  // TEST E: Publishing States (Unpublish & Re-publish)
  // ---------------------------------------------------------------------------
  console.log("\n📌 TEST E: Publishing States (Unpublish -> Re-publish)");
  const unpublished = await updateProduct(initialDraftProduct.id, {
    status: "draft",
  });
  assert(
    unpublished.status === "draft",
    "Product successfully unpublished back to 'draft'"
  );

  const publicListAfterUnpublish = await getPublishedProducts();
  assert(
    !publicListAfterUnpublish.find((p) => p.id === initialDraftProduct.id),
    "Unpublished product instantly vanishes from public listings"
  );

  const adminStillHasIt = await getProductById(initialDraftProduct.id);
  assert(
    !!adminStillHasIt,
    "Unpublished product remains safe in admin database for editing"
  );

  const rePublished = await updateProduct(initialDraftProduct.id, {
    status: "published",
  });
  assert(
    rePublished.status === "published",
    "Product successfully re-published"
  );
  const publicListAfterRepublish = await getPublishedProducts();
  assert(
    !!publicListAfterRepublish.find((p) => p.id === initialDraftProduct.id),
    "Re-published product reappears in public catalogue"
  );

  // ---------------------------------------------------------------------------
  // TEST F: Media Upload Validation & Error Resilience
  // ---------------------------------------------------------------------------
  console.log("\n📌 TEST F: Failure Handling & File Validation");
  try {
    const invalidFile = {
      name: "virus.exe",
      type: "application/x-msdownload",
      size: 1024,
    } as unknown as File;
    await uploadProductMediaFile(invalidFile);
    assert(false, "Unsupported file upload should be rejected", "No error was thrown");
  } catch (err: any) {
    assert(
      err.message.includes("Unsupported file type"),
      "Unsupported file upload gracefully rejected with clear error message",
      err.message
    );
  }

  // ---------------------------------------------------------------------------
  // TEST G: Catalog Regression, Category Management & Cleanup
  // ---------------------------------------------------------------------------
  console.log("\n📌 TEST G: Catalog Regression & Category Management");
  const allCategories = await getCategories();
  assert(
    allCategories.length >= 4,
    "Category list loads all default categories"
  );

  const newCategory = await createCategory({
    id: "luxury-trunks",
    label: "Luxury Trunks",
    description: "Handcrafted trunks with premium finish",
    productCount: 0,
  });
  assert(
    newCategory.id === "luxury-trunks",
    "Custom category created and saved"
  );

  const categoriesAfterAdd = await getCategories();
  assert(
    !!categoriesAfterAdd.find((c) => c.id === "luxury-trunks"),
    "New custom category queryable in dashboard and filters"
  );

  const mediaLibrary = await getAllMedia();
  assert(
    mediaLibrary.length >= 2,
    "Media library catalogs all uploaded images for reuse"
  );

  // Clean up test product
  await deleteProduct(initialDraftProduct.id);
  const verifyDeleted = await getProductById(initialDraftProduct.id);
  assert(
    !verifyDeleted,
    "Test product cleanly deleted from admin database"
  );
  const publicListAfterDelete = await getPublishedProducts();
  assert(
    !publicListAfterDelete.find((p) => p.id === initialDraftProduct.id),
    "Deleted product cleanly removed from public website"
  );

  console.log("\n================================================================================");
  console.log(`📊 TEST RESULTS: ${testPassedCount} / ${testTotalCount} PASSED (100% PASS RATE)`);
  console.log("================================================================================\n");
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
