module.exports =  (page , data) => {
    let output = page.replace(/{product_name}/g , data.productName);
    output = output.replace(/{image}/g , data.image);
    output = output.replace(/{price}/g , data.price);
    output = output.replace(/{from}/g , data.from);
    output = output.replace(/{nutrients}/g , data.nutrients);
    output = output.replace(/{quantity}/g , data.quantity);
    output = output.replace(/{description}/g , data.description);
    output = output.replace(/{id}/g , data.id);

    if(!data.organic){
        output = output.replace(/{organic}/g , 'not-organic');
    }
    return output;
}