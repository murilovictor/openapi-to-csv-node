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


### Csv File Example

|title|version|path|method|descriptionEndpoint|summaryEndpoint|fieldName|currentPath|descriptionField|example|required|exampleModel|
|-----|-------|----|------|-------------------|---------------|---------|-----------|----------------|-------|--------|------------|
|API InsuranceAuto - Open Insurance Brasil|1.1.0|/{policyId}/policy-info|get|Método para obter as informações gerais da apólice|Obtém as informações gerais da apólice identificada por {policyId}|identificationType|.data.insureds[0].identificationType|Tipo de Documento da Pessoa|CPF|SIM|CPF, CNPJ, OUTROS|


### Params Exemple

| Query Param | Description | type    |
|-------------|-------------|---------|
| onlyRequired | exports only required fields for each endpoint | boolean |
| exportToCsv | export the file in the project directory out/... | boolean |

## 🚀 How to run?

- Clone the repository
- Run `yarn` for download the dependencies
- Run `yarn dev` for start the application.

Finally, the application will be available on `http://localhost:3000/api/openapi?onlyRequired=false&exportToCsv=true`

## 📄 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
