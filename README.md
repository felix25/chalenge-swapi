# Desafío: API de Star Wars con DynamoDB y Serverless

Este proyecto consiste en un desafío técnico que realiza varias funciones para consumir y almacenar datos de la API de Star Wars en DynamoDB. A continuación, se detallan sus características y funcionalidades.

## Instalar dependencias
`npm install`

## Funcionalidades del Proyecto

1. **Consumo de API REST**
   - El proyecto consume la API pública de Star Wars: [https://swapi.py4e.com/api/people/](https://swapi.py4e.com/api/people/)
   
2. **Registro de Datos en DynamoDB**
   - Los datos obtenidos de la API se almacenan en una base de datos DynamoDB, y se realiza la conversión de las claves de los datos del inglés al español para adaptarse mejor al contexto.

3. **Endpoints de la API**
   - El proyecto incluye dos endpoints para interactuar con los datos almacenados:
   
     - **[POST] Crear Entrada:** [https://miehmu9fyj.execute-api.us-east-1.amazonaws.com/dev/star-wars/create](https://miehmu9fyj.execute-api.us-east-1.amazonaws.com/dev/star-wars/create)  
       Este endpoint permite registrar datos en la base de datos a partir de la página indicada de la API externa.  
       - **Ejemplo de Request:**
         ```json
         {
           "page": 1
         }
         ```
       - **Nota:** Cambia el valor de `page` para obtener datos de diferentes páginas de la API de Star Wars.

     - **[GET] Listar Todos los Datos:** [https://miehmu9fyj.execute-api.us-east-1.amazonaws.com/dev/list/all](https://miehmu9fyj.execute-api.us-east-1.amazonaws.com/dev/list/all)  
       Este endpoint lista todos los datos previamente registrados en DynamoDB.

4. **Pruebas Unitarias**
   - El proyecto incluye pruebas unitarias para garantizar la funcionalidad de las distintas partes de la aplicación:
     - Ejecuta todas las pruebas con el comando:
       ```bash
       npm run test
       ```
     - Consulta la cobertura de las pruebas en todos los archivos con el comando:
       ```bash
       npm run coverage
       ```

5. **Despliegue del Proyecto**
   - El proyecto se gestiona y despliega con **Serverless Framework** para facilitar la implementación en AWS Lambda. Las instrucciones de despliegue son las siguientes:
     - **Despliegue Completo:**  
       Ejecuta el siguiente comando para desplegar el proyecto completo:
       ```bash
       serverless deploy --aws-profile developers
       ```

     - **Despliegue de Función Específica:**  
       Si solo deseas actualizar una función específica, utiliza el siguiente comando:
       ```bash
       serverless deploy function -f {nombreFuncion} --aws-profile developers
       ```
       - Reemplaza `{nombreFuncion}` con el nombre de la función deseada, por ejemplo: `getStarWars`.

---

¡Este proyecto está listo para facilitar el acceso a datos de Star Wars con una arquitectura serverless y DynamoDB!
