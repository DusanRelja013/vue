import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ApplicationService from '@/services/ApplicationService'
import { useToasterStore } from '@/stores/Toaster'

export const useCartStore = defineStore('cart', {
  state: () => ({
    selectedItems: [],
    summary: null,
    totalAmount: 0
  }),
  getters: {
    getCartItems: (state) => state.selectedItems,
    getCartSummary: (state) => state.summary,
    getTotalAmount: (state) => state.totalAmount
  },
  actions: {
    initialCartItems(items = []) {
      const customerId = localStorage.getItem('customer_id')
      const retrievedICards = localStorage.getItem('cartItems')

      if (customerId && items.length) {
        this.selectedItems = items
        return
      }

      if (retrievedICards) {
        this.selectedItems = JSON.parse(retrievedICards)
      }
    },
    addCartItem(item: any, officeId: any) {
      const items: any = [...this.selectedItems]
      let itemIndex = null
      if (item.RunwayId) {
        itemIndex = items.findIndex(
          (selectedItem: any) =>
            selectedItem.RunwayId === item.RunwayId &&
            selectedItem.NoOfEntries === item.NoOfEntries &&
            selectedItem.Validity === item.Validity &&
            selectedItem.ProcessingSpeedCode === item.ProcessingSpeedCode
        )
        if (itemIndex > -1) {
          if (items[itemIndex]?.Quantity) {
            items[itemIndex].Quantity += item.Quantity
          } else {
            items[itemIndex].Quantity = 1
          }
        }
      }
      if (!item.RunwayId) {
        itemIndex = items.findIndex(
          (selectedItem: any) => selectedItem.code === item.code
        )

        if (itemIndex > -1) {
          if (items[itemIndex]?.quantity) {
            items[itemIndex].quantity += 1
          } else {
            items[itemIndex].quantity = 1
          }
        }
      }
      if (itemIndex <= -1) {
        items.push(item)
      }
      this.selectedItems = items
      const customerId = localStorage.getItem('customer_id')

      const data: any = {
        office_id: officeId,
        main: [],
        secondary: []
      }

      items.forEach((item: any) => {
        if (item.RunwayId) {
          data.main.push({
            RunwayId: item.RunwayId,
            OfatCode: item.OFatCode,
            NoOfEntries: item.NoOfEntries,
            Validity: item.Validity,
            ProcessingSpeedCode: item.ProcessingSpeedCode,
            ServiceType: item.OfatCode,
            Quantity: item.Quantity
          })
        }
        if (!item.RunwayId) {
          data.secondary.push({
            code: item.code,
            quantity: item.quantity
          })
        }
      })

      if (customerId && items.length) {
        ApplicationService.updateBasket(customerId, {
          basket: this.selectedItems
        }).then((basket: any) => {
          ApplicationService.calculateBasket(data)
            .then((response: any) => {
              this.summary = response.summary
              localStorage.setItem(
                'totalCart',
                response.summary.totalAmountWithTax
              )
            })
            .then(() => {
              const ToasterStore = useToasterStore()
              ToasterStore.updateToaster({
                message: 'Item is added to the cart',
                type: 'success',
                duration: 3000
              })
            })
        })
      }
      if (!customerId && items.length) {
        localStorage.setItem('cartItems', JSON.stringify(items))
        ApplicationService.calculateBasket(data)
          .then((response: any) => {
            this.summary = response.summary
            localStorage.setItem(
              'totalCart',
              response.summary.totalAmountWithTax
            )
          })
          .then(() => {
            const ToasterStore = useToasterStore()
            ToasterStore.updateToaster({
              message: 'Product added to basket',
              type: 'success',
              duration: 3000
            })
          })
      }
    },
    removeCartItem(item: any, officeId: any) {
      const items = [...this.selectedItems]
      let itemIndex: any = null
      if (item.RunwayId) {
        itemIndex = items.findIndex(
          (selectedItem: any) =>
            selectedItem.RunwayId === item.RunwayId &&
            selectedItem.NoOfEntries === item.NoOfEntries &&
            selectedItem.Validity === item.Validity &&
            selectedItem.ProcessingSpeedCode === item.ProcessingSpeedCode
        )
      }
      if (!item.RunwayId) {
        itemIndex = items.findIndex(
          (selectedItem: any) => selectedItem.code === item.code
        )
      }
      if (itemIndex > -1) {
        items.splice(itemIndex, 1)
      }
      this.selectedItems = items
      const customerId = localStorage.getItem('customer_id')
      if (customerId) {
        const data: any = {
          office_id: officeId,
          main: [],
          secondary: []
        }
        if (!items.length) {
          ApplicationService.deleteBasket(customerId).then(() => {
            ApplicationService.calculateBasket(data).then((response: any) => {
              this.summary = response.summary
              localStorage.setItem(
                'totalCart',
                response.summary.totalAmountWithTax
              )
            })
          })
        }

        if (items.length) {
          items.forEach((item: any) => {
            if (item.RunwayId) {
              data.main.push({
                RunwayId: item.RunwayId,
                OfatCode: item.OFatCode,
                NoOfEntries: item.NoOfEntries,
                Validity: item.Validity,
                ProcessingSpeedCode: item.ProcessingSpeedCode,
                ServiceType: item.OfatCode,
                Quantity: item.Quantity
              })
            }
            if (!item.RunwayId) {
              data.secondary.push({
                code: item.code,
                quantity: item.quantity
              })
            }
          })

          ApplicationService.updateBasket(customerId, {
            basket: this.selectedItems
          }).then((basket: any) => {
            ApplicationService.calculateBasket(data).then((response: any) => {
              this.summary = response.summary
              localStorage.setItem(
                'totalCart',
                response.summary.totalAmountWithTax
              )
            })
          })
        }
      } else {
        const data: any = {
          office_id: officeId,
          main: [],
          secondary: []
        }
        if (items.length) {
          items.forEach((item: any) => {
            if (item.RunwayId) {
              data.main.push({
                RunwayId: item.RunwayId,
                OfatCode: item.OFatCode,
                NoOfEntries: item.NoOfEntries,
                Validity: item.Validity,
                ProcessingSpeedCode: item.ProcessingSpeedCode,
                ServiceType: item.OfatCode,
                Quantity: item.Quantity
              })
            }
            if (!item.RunwayId) {
              data.secondary.push({
                code: item.code,
                quantity: item.quantity
              })
            }
          })
        }
        ApplicationService.calculateBasket(data).then((response: any) => {
          this.summary = response.summary
          localStorage.setItem('totalCart', response.summary.totalAmountWithTax)
        })
        localStorage.setItem('cartItems', JSON.stringify(items))
      }
    },
    updateCartQuantity(card: any, officeId: any) {
      const items: any = [...this.selectedItems]
      let itemIndex = null
      if (card.RunwayId) {
        itemIndex = items.findIndex(
          (selectedItem: any) =>
            selectedItem.RunwayId === card.RunwayId &&
            selectedItem.NoOfEntries === card.NoOfEntries &&
            selectedItem.Validity === card.Validity &&
            selectedItem.ProcessingSpeedCode === card.ProcessingSpeedCode
        )
        if (itemIndex > -1) {
          items[itemIndex] = card
        }
      }

      if (!card.RunwayId) {
        itemIndex = items.findIndex(
          (selectedItem: any) => selectedItem.code === card.code
        )

        if (itemIndex > -1) {
          items[itemIndex] = card
        }
      }

      this.selectedItems = items
      const customerId = localStorage.getItem('customer_id')

      if (customerId) {
        const data: any = {
          office_id: officeId,
          main: [],
          secondary: []
        }
        if (!this.selectedItems.length) {
          ApplicationService.deleteBasket(customerId).then(() => {
            ApplicationService.calculateBasket(data).then((response: any) => {
              this.summary = response.summary
              localStorage.setItem(
                'totalCart',
                response.summary.totalAmountWithTax
              )
            })
          })
        }

        if (items.length) {
          items.forEach((item: any) => {
            if (item.RunwayId) {
              data.main.push({
                RunwayId: item.RunwayId,
                OfatCode: item.OFatCode,
                NoOfEntries: item.NoOfEntries,
                Validity: item.Validity,
                ProcessingSpeedCode: item.ProcessingSpeedCode,
                ServiceType: item.OfatCode,
                Quantity: item.Quantity
              })
            }
            if (!item.RunwayId) {
              data.secondary.push({
                code: item.code,
                quantity: item.quantity
              })
            }
          })

          ApplicationService.updateBasket(customerId, {
            basket: this.selectedItems
          }).then((basket: any) => {
            ApplicationService.calculateBasket(data).then((response: any) => {
              this.summary = response.summary
              localStorage.setItem(
                'totalCart',
                response.summary.totalAmountWithTax
              )
            })
          })
        }
      } else {
        const data: any = {
          office_id: officeId,
          main: [],
          secondary: []
        }
        if (items.length) {
          items.forEach((item: any) => {
            if (item.RunwayId) {
              data.main.push({
                RunwayId: item.RunwayId,
                OfatCode: item.OFatCode,
                NoOfEntries: item.NoOfEntries,
                Validity: item.Validity,
                ProcessingSpeedCode: item.ProcessingSpeedCode,
                ServiceType: item.OfatCode,
                Quantity: item.Quantity
              })
            }
            if (!item.RunwayId) {
              data.secondary.push({
                code: item.code,
                quantity: item.quantity
              })
            }
          })
        }
        localStorage.setItem('cartItems', JSON.stringify(this.selectedItems))
        ApplicationService.calculateBasket(data).then((response: any) => {
          this.summary = response.summary
          localStorage.setItem('totalCart', response.summary.totalAmountWithTax)
        })
      }
    },
    clearCart() {
      this.selectedItems = []
      this.summary = null
    },
    initialTotalAmount(total: any) {
      this.totalAmount = total
    },
    updateBasket(officeId: any) {
      const items: any = [...this.selectedItems]
      const customerId = localStorage.getItem('customer_id')

      const data: any = {
        office_id: officeId,
        main: [],
        secondary: []
      }

      items.forEach((item: any) => {
        if (item.RunwayId) {
          data.main.push({
            RunwayId: item.RunwayId,
            OfatCode: item.OFatCode,
            NoOfEntries: item.NoOfEntries,
            Validity: item.Validity,
            ProcessingSpeedCode: item.ProcessingSpeedCode,
            ServiceType: item.OfatCode,
            Quantity: item.Quantity
          })
        }
        if (!item.RunwayId) {
          data.secondary.push({
            code: item.code,
            quantity: item.quantity
          })
        }
      })
      if (customerId && items.length) {
        ApplicationService.updateBasket(customerId, {
          basket: this.selectedItems
        }).then((basket: any) => {
          ApplicationService.calculateBasket(data).then((response: any) => {
            this.summary = response.summary
            localStorage.removeItem('cartItems')
            localStorage.setItem('totalCart', response.summary)
          })
        })
      }
    },
    clearBasket(customerId: string, officeId: string) {
      const data: any = {
        office_id: officeId,
        main: [],
        secondary: []
      }
      ApplicationService.deleteBasket(customerId).then(() => {
        ApplicationService.calculateBasket(data).then((response: any) => {
          this.selectedItems = []
          this.summary = response.summary
          localStorage.setItem('totalCart', response.summary)
        })
      })
    }
  }
})
