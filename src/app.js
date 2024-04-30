// 
// 
document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
    items:[
        { id:1, name: 'Robusta Brazil', img: '1.jpg' , price: 20000 },
        { id:2, name: 'Arabica Blend', img:'1.jpg', price: 30000 }, 
        { id:3, name: 'Aceh Gayo', img:'1.jpg', price: 30000 },
        { id:4, name: 'Sumatera Mandheling', img:'1.jpg', price: 40000 },
    ],
    }))

    Alpine.store('cart', {
        items:[],
        total: 0,
        quantity:0,
        add(newItem){
            const cartItem = this.items.find((item)=>item.id===newItem.id);

            if(!cartItem) {
                this.items.push({...newItem, quantity:1,total:newItem.price})
                this.quantity++
                this.total += newItem.price
            }else{
                this.items = this.items.map((item)=>{
                    if(item.id !== newItem.id){
                        return item
                    }else{
                        item.quantity++
                        item.total = item.price * item.quantity
                        this.quantity++
                        this.total += newItem.price
                        return item
                    }
                })
            }
        },
        remove(id){
            console.log(id);
            const cartItem = this.items.find((item) => item.id === id)

            if(cartItem.quantity > 1){
                this.items = this.items.map((item) => {
                    if(item.id !== id){
                        return item
                    }else{
                        item.quantity--
                        item.toal = item.price * item.quantity
                        this.quantity--
                        this.total -= item.price
                        return item
                    }
                })
            }else if(cartItem.quantity == 1){
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--
                this.total -= cartItem.price
                return item
            }
        }
    })
})

const checkoutButton = document.querySelector('.checkout-button')
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm')

form.addEventListener('keyup', function(){
    for (let i = 0; i < form.length; i++) {
        if(form.elements[i].value !== 0){
            checkoutButton.classList.remove('disabled')
            checkoutButton.classList.add('disabled')
        }else{
            return false
        }
    }
    checkoutButton.disabled = false
    checkoutButton.classList.remove('disabled')
})

checkoutButton.addEventListener('click', async function(e){
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    // const message = formatMessage(objData);
    // window.open('http://wa.me/6283832184752?text=' + encodeURIComponent(message))

    try {
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            body: data,
        })
        const token = await response.text();
        window.snap.pay(token);
    } catch (err) {
        console.log(err.message)
    }
})

const formatMessage = (obj) =>{
    return`*Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No HP: ${obj.phone}

*Data Pesanan
${JSON.parse(obj.items).map((item)=> `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}

TOTAL: ${rupiah(obj.total)}
Terimakasih.
    `
}

// convert to rupiah
const rupiah = (number)=>
{
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(number)
}