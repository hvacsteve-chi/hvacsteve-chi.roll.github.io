(function () {

  // 1.)Check if the IndexedDB is supported

  // The following code checks if a web browser supports the indexedDB:

  if(!window.indexedDB){
    console.log(`Your browser doesn't support IndexedDB`);
    return;
  }

  // 2)Open a database

  // To open a connection o a database, you use the open() method of the window.indexedDBL

  const request = indexedDB.open('CRM', 1);

  // The open() method accepts two arguments:

  // -The database name (CRM)

  // -The database version(1)

  // The open() method returns a request object which is an instance of the IDBOpenDBRequest interface.

  // When you call the open() method, it can succeed or fail. To handle each case, you can assign the corresponding event handler as follows:

  request.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
  };
  request.onsuccess = (event) => {
    // add implementation here
  };

  // 3) Create object stores

  // When you open the database for the first time, the onupgradeneeded event trigger will trigger.

  // If you open the database for the second time with a version higher than the existing, the onupgradeneeded event also triggers.

  // For the firSt time, you can use the onupgradeneeded event handle to initialize the object stores and indexes.

  // For example, the following onupgradeneeded event handler creates the Contacts object store and its index.

  // create the Contacts object store and indexes
  request.onupgradeneeded = (event) => {
    let db = event.target.result;

    // create the Contacts object store
    // with auto-increment id
    let store = db.createObjectStore('Contacts', {
      autoIncrement: true
    });

    // create an index on the email property
    let index = store.createIndex('email', 'email', {
      unique: true
    });
  };


  // How it works.

  // -  First, get the IDBDatabase instance from the event.target.result and assign it to the db variable.

  // - Second, call the createObjectStore() method to create the Contacts object store with the auto increment key. It means that the IndexedDB will generate an auto-increment number starting at one as the key for every new object inserted into the Contact object store.

  // - Third, call the createIndex() method to create an index on the email property. Since the email is unique, the index should also be unique.  To do so, you specify the third argument of the createIndex() method { unique: true }.

  // 4) Insert data into object stores

  // Once you open a connection to the database successfully, you can manage data in the onsuccess event handler.

  // For example, to add an object to an object store, you follow these steps:
  // First, open a new transaction.

  // Second, get an object store.

  // Third, call the put() method of the object store to insert a new record.

  // Finally, close the connection to the database once the transaction completes.

  // The following insertContact() function inserts a new contact into the Contacts object store:

  function insertContact(db, contact) {
    // create a new transaction
    const txn = db.transaction('Contacts', 'readwrite');
    // get the Contacts object store
    const store = txn.objectStore('Contacts');
    //
    let query = store.put(contact);
    // handle success case
    query.onsuccess = function (event) {
      console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
      console.log(event.target.errorCode);
    }

    // close the database once the
    // transaction completes
    txn.oncomplete = function () {
      db.close();
    };
  }

  // To create a new transaction, you cal the transaction() method of the IDBDatabase object.

  // You can open a transaction in one of two modes: readwrite or readonly.  The readwrite mode allows hou to read data from and write data to the database while the readonly mode allows you to only read data from the database.

  // It's a good practice to open readonly transaction if you need to read data from a database only.

  // After defining the insertContact() function, you can call it in the onsuccess event handler of the request to insert one or more contacts like this:

  request.onsuccess = (event) => {
    const db = event.target.result;

    insertContact(db, {
      email: 'john.doe@outlook.com',
      firstName: 'John',
      lastName: 'Doe'
    });

    insertContact(db, {
      email: 'jane.doe@gmail.com',
      firstName: 'Jane',
      lastName: 'Doe'
    });
  };

  // Now, if you open the index.html file in ghe web browser, the code in the app.js will execute to:

  // - Create the CRM database in the IndexedDB.

  // - Create the Contacts object store in the CRM database.

  // - Insert two records into the object store.

  // If you open the devtools on the web browser, you'll see the CRM database with the Contact object store.  And in the Contacts object store, you'll see the data there as shown in the following picture:

  // 5) Read data from the object store by key

  // To read an object by its key, you use the get() method of teh object store.  The following getContactById() function finds a contact by an id:

function getContactById(db, id) {
  const txn = db.transaction('Contacts', 'readonly');
  const store = txn.objectStore('Contacts');
  let query = store.get(id);

  query.onsuccess = (event) => {
    if(!event.target.result) {
      console.log(`The contact with ${id} not found`);
    } else {
      console.table(event.target.result);
    }
  };
  
  query.onerror = (event) => {
    console.log(event.target.errorCode);
  }

  txn.oncomplete = function () {
    db.close();
  };
};
// When you call the get() method of the object store, it returns a query that will execute asynchronously.

// Because the query can succeed or fail, you need to assign the onsuccess and onerror handlers each case.

// If the query succeeded, you'll get the result in the event.target.result.  Otherwise, you'll get an error code via event.target.errorCode.

// The following code closes the connection to the database once the transaction completes:

txn.oncomplete = function () {
  db.close();
};

// Actually, the database connection is closed only when when all the transactions are completed.

// The following calls the getContactById() in the onsuccess event handler to get the contact with id 1.

request.onsuccess = (event) => {
  const db = event.target.results;
  getContactById(db, 1);
};

// 6) Read data from the object store by an index

// The following defines a new function called getContactByEmail() that uses the email index to query data:

function getContactByEmail(db, email) {
  const txn = db.transaction(
    'Contacts', 'readonly');
    const store = txn.objectStore('Contacts');

    // get the index from the Object Store
    const index = store.index('email');
    // query by indexes
    let query = index.get(email);

    // return the result object on success
    query.onsuccess = (event) => {
      console.log(event.target.errorCode);
    }

    // close the database connection
    txn.oncomplete = function(){
      db.close();
    };
}

// How it works.

// - First, get the email index object from the Contacts object store.

// - Second, use the index to read teh data by calling the get() method.

// - Third, sow the result in the onsuccess event handler if of the query.

// The following illustrates how to use the getContactsByEmail() function in the onsuccess event handler:
request.onsuccess = (event) => {
  const db = event.target.result;
// get contact by email
  getContactByEmail(db, 'jane.doe@gmail.com');
};

// 7) Read all data from an object store

// The following shows how to use a cursor to read all the objects from the Contacts object store:

function getAllContacts(db){
  const txn = db.transaction('Contacts', "readonly");
  const objectStore = txn.objectStore('Contacts');

  objectStore.openCursor().onsuccess = (event) => {
    let cursor = event.target.result;
    if(cursor) {
      let contact = cursor.value;
      console.log(contact);
      // continue next record
      cursor.continue();
    }
  };
  // close the database connection
  txn.oncomplete = function() {
    db.close();
  };
}

// The objectStore.openCursor() returns a cursor used to iterate over an object store.
// To iterate over the objects in an object store using the cursor, you need to assign an onsuccess handler:

objectStore.openCursor().onsuccess = (event) => {
  // ...
};

// the event.target.result returns the cursor.  To get the data, you use the cursor.value property.

// the cursor.continue() method advances the cursor to the position of the next record in the object store.

// The following calls the getAllContacts() in the onsuccess event handler to show all data from the Contacts object store:

request.onsuccess = (event) => {
  const db = event.target.result;
  // get all contacts
  getAllContacts(db);
};

// 8) Delete a contact

// To delete a record from the object store, you use the delete()method of the object store.

// The following function deletes a contact by its id from the Contacts object store:

function deleteContact(db, id){

  // create a new transaction
  const txn = db.transaction('Contacts', 'readwrite');

  // get the Contacts object store
  const store = txn.objectStore('Contacts');
  //
  let query = store.delete(id);

  // handle the success case
  query.onsuccess = function (event) {
    console.log(event);
  };

  // handle the error case
  query.onerror = function (event) {
    console.log(event.target.errorCode);
  }

  // close the database once the transaction completes
  txn.oncomplete = function () {
    db.close();
  };
}

// And you can call the deleteContact() function in the onsuccess event handler to delete the contact with id 1 as follows:

request.onsuccess = (event) => {
  const db = event.target.result;
  deleteContact(db, 1);
};

})();

// SUMMARY

// - The IndexedDB is a large-scale object stored in web browsers.

// - The IndexedDB stores data as key-value pairs.  The values can be any data including simple and complex ones.

// - The IndexedDB consists of one or more databases.  Each database has one or more object stores. Typically, you create a database in the IndexedDB per web application.

// - The IndexedDB is useful for web applications that don't require a persistent internet connection, especially for application that work both online and offline.