
<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/39abb82b-7327-4d16-954e-b450ad347df9" alt="Markdownify" width="200">

</h1>

<h4 align="center">Uma API Rest para a leitura de medidores.</h4>
 <br />


 ![image](https://img.shields.io/badge/typescript-blue?style=for-the-badge&logo=typescript&logoColor=white)
 ![image](https://img.shields.io/badge/adonis-black?style=for-the-badge&logo=adonisjs&logoColor=white)
 ![image](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
 ![image](https://img.shields.io/badge/node-5FA04E?style=for-the-badge&logo=javascript&logoColor=white)
 ![image](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)




Para usar, siga estas etapas.
É necessário possuir o Docker instalado.

```
git clone https://github.com/davimcostaa/measures_shopper.git
```


Crie um chave de API no <a href='https://ai.google.dev/gemini-api/docs/api-key?hl=pt-br'> site do Google Gemini <a/> 
e cole no arquivo .env
```
GEMINI_API_KEY=
```
Crie o container
```
docker-compose up
```

### Requisição

`POST /upload/`

    curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' 
		-d '{
		  "measure_datetime": "",
		  "measure_type": "",
		  "customer_code": "",
		  "image": ""
		}' http://127.0.0.1:3333/upload

### Resposta 200 OK

		 {
		"measure_uuid": "",
		"measure_value": ",
		"image_url": ""
		 }

### Requisição

`PATCH /confirm/`

    curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' 
		-d '{
		"measure_uuid":"",
		"confirmed_value": 
		}' http://127.0.0.1:3333/upload

### Resposta 200 OK

		{
	        "success": true,
		}

 ### Requisição

`GET /:costumer_code/list?measure_type=`

    curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' http://127.0.0.1:3333/upload

### Resposta 200 OK

		{
		"customer_code": "",
		"measures": [
		{
		"measure_uuid": "",
		"measure_datetime": "",
		"measure_type": "",
		"measure_value": ,
		"has_confirmed": ,
		"image_url": ""
		}]

> [Portfolio](https://portfolio-davi-costa.vercel.app/pt) &nbsp;&middot;&nbsp;
> [Linkedin](https://www.linkedin.com/in/davi-marquesc/) 
