# phonebook

A REST API for a phonebook. A phonebook entry must have the following fields:
* Firstname
* Surname
* Phone

Optionally an "Address" field can also be provided.

The JSON representation of a phonebook entry with all fields looks as follows:
```
{
  "Surname": "Messa",
  "Firstname": "Josie",
  "Phone": 37245219,
  "Address": 
  {
    "House": "Hursley House",
    "Street": "Hursley Park",
    "Address Line 1": "Hursley",
    "City": "Winchester",
    "Postcode": "SO21 2JN"
  }
}
```

# Usage

Clone the project, navigate to the phonebook directory and run:
```
$ npm install
```
to install all required modules. Once successfully installed, run:
```
$ node main.js
```
This will start up an express server on port 3000.

## List all entries in the phone book.
**GET** `/phonebook`

Will return JSON with a list of entries in the phonebook. Entries are indexed by a numerical ID.

## Create a new entry to the phone book.
**POST** `/phonebook`

Send a valid JSON phonebook entry (as described above) as the request body. The response will include a `location` header where the entry can be retrieved.

## Remove an existing entry in the phone book.
**DELETE** `/phonebook/{id}`

Ensure the `id` parameter matches an existing phonebook entry.

## Update an existing entry in the phone book.
**PUT** `/phonebook/{id}`

Ensure the `id` parameter matches an existing phonebook entry. The request body should include any fields which need to be updated. The response will include a `location` header where the entry can be retrieved.

## Search for entries in the phone book by surname.
**GET** `/phonebook?surname={searchTerm}`

Supply the surname you wish to search for as a query parameter. The response will be JSON indexed by ID of all phonebook entries with matching surnames. Searches are case sensitive.

## Retrieve a single phonebook entry by ID
**GET** `/phonebook/{id}`

Ensure the `id` parameter matches an existing phonebook entry. The response will contain the single phonebook entry indexed by the provided ID. Requests can be made to the URI supplied in the `location` header in response to a POST or PUT.

# Running the tests
Ensure the server is started up. In the `phonebook` directory, run:
```
$ mocha
```
There are 12 tests to be run which test acceptance criteria and basic error checking.
