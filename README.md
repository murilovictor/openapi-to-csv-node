<h1>Openapi attributes converter to csv</h1>

<p>
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000">
</p>

## ✨ Technologies

This project was developed with the following technologies:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)

## 💻 Project

The objective of this project is to export all attributes from an openapi (JSON) file to a CSV file and rest api.


### 👌 Csv File example
title;version;path;method;descriptionEndpoint;summaryEndpoint;currentPath;fieldName;required;descriptionField;minLength;maxLength;type;example;exampleModel;format;pattern

| title                                         | version   | path      | method                                                                | descriptionEndpoint                 | summaryEndpoint | currentPath | fieldName                                                                                                                                                                                         | required | descriptionField | minLength | maxLength      | type                                                  | example | exampleModel | format | pattern |
|-----------------------------------------------|-----------|-----------|-----------------------------------------------------------------------|-------------------------------------|-----------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|------------------|-----------|----------------|-------------------------------------------------------|---------|--------------|--------|---------|
| APIs Open Data do Open Insurance Brasil	1.2.0 | /branches | get - 200 | Método para obter a listagem de dependências próprias da instituição. | .data.brand.companies[0].cnpjNumber | cnpjNumber      | SIM         | Número completo do CNPJ da instituição responsável pela dependência - o CNPJ corresponde ao número de inscrição no Cadastro de Pessoa Jurídica.Deve-se ter apenas os números do CNPJ, sem máscara | 14       | 14               | string    | 45086338000178 | POSTO_ATENDIMENTO, UNIDADE_ADMINISTRATIVA_DESMEMBRADA | xxxxxx  | ^(\d{14})$   | ^NA$   |

Extract service based on a POST method for processing a single openapi (json)
### Params example

| Query Param      | Description                                                    | type    | default | example                  |
|------------------|----------------------------------------------------------------|---------|---------|--------------------------|
| onlyRequired     | Exports only required fields for each endpoint                 | boolean | false   | onlyRequired=true        |
| exportToCsv      | Export the file in the project directory out/...               | boolean | false   | exportToCsv=true         |
| statusCodeExport | Exports only attributes according to the informed status code. | number  | 200     | statusCodeExport=201,500 |

## 🚀 How to run?

- Clone the repository
- Run `yarn` for download the dependencies
- Run `yarn dev` for start the application.

Finally, the application will be available on `http://localhost:3000/openapi/toCsv`

#### 💣 Curl example
```bash
curl --location --request POST 'http://localhost:3000/openapi/toCsv?onlyRequired=false&exportToCsv=true&statusCodeExport=200, 201, 202' \
--header 'Content-Type: application/json' \
--data-raw '{YOUR_JSON_HERE}'
```


Extract service based on a POST method for processing a multiple openapi (json)


| Query Param      | Description                                                    | type    | default | example                                                       |
|------------------|----------------------------------------------------------------|---------|---------|---------------------------------------------------------------|
| onlyRequired     | Exports only required fields for each endpoint                 | boolean | false   | onlyRequired=true                                             |
| exportToCsv      | Export the file in the project directory out/...               | boolean | false   | exportToCsv=true                                              |
| statusCodeExport | Exports only attributes according to the informed status code. | number  | 200     | statusCodeExport=201,500                                      |
| dirPath          | C:\developer\workspace\node\openapi-to-csv-node\input          | string  | null    | dirPath=C:\developer\workspace\node\openapi-to-csv-node\input |

#### 💣 Curl example
```bash
curl --location --request GET 'http://localhost:3000/openapi/convertFromPath?onlyRequired=false&exportToCsv=true&statusCodeExport=200%2C204&dirPath=C%3A%5Cdeveloper%5Cworkspace%5Cnode%5Copenapi-to-csv-node%5Cinput'
```

## 📄 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
