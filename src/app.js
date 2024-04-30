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

// convert to rupiah
const rupiah = (number)=>
{
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(number)
}