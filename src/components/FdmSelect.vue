<template>
	<div class="select">
		<div
			class="select__head"
			@click="onClick"
		>
			<input
				ref="fdmSelect"
				v-model="inputValue"
				type="text"
				:disabled="disabled"
				:class="{ 'is-invalid' : hasError }"
				:placeholder="inputPlaceholder"
				@focusout="onFocusOut"
				@input="onSearch"
			>
			<img
				src="../assets/icons/chevron-down-sm.svg"
				alt=""
			>
		</div>
		<div
			id=""
			class="select__body"
			:class="{ 'hide' : !showOptions }"
		>
			<div
				v-for="(item, index) in filteredOptions"
				:key="index"
				class="select__option"
				:class="{ 'selected' : checkSelected(item.id) }"
				@click="onSelect(item)"
			>
				{{ item.title }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FdmSelect',
	props: {
		options: { type: Array, default: () => [] },
		isMultiple: { type: Boolean, default: false },
		multipleSelectedIds: { type: Array, default: () => [] },
		selectedId: { type: Number, default: 0 },
		hasError: { type: Boolean, default: false }
	},
	data () {
		return {
			disabled: true,
			showOptions: false,
			selected: {},
			multipleSelected: [],
			inputValue: '',
			filteredOptions: [],
			isSearching: false
		}
	},
	computed: {
		inputPlaceholder () {
			if (this.isMultiple) return this.multipleSelected.map(i => i.title).join(', ')
			else return  this.selected.title
		}
	},
	watch: {
		options (items) {
			this.filteredOptions = items
			this.multipleSelected = this.options.filter(i => this.multipleSelectedIds.includes(i.id))
			this.inputValue = this.multipleSelected.map(i => i.title).join(', ')
		},
		// multipleSelectedIds (values) {
		// 	this.multipleSelected = this.options.filter(i => values.includes(i.id))
		// 	this.inputValue = this.multipleSelected.map(i => i.title).join(', ')
		// },
		// selectedId (value) {
		// 	this.selected = this.options.find(i => i.id === value)
		// 	this.inputValue = this.selected.title
		// }
	},
	mounted () {
		window.addEventListener('click', this.onOutsideClick)
	},
	beforeDestroy () {
		window.removeEventListener('click', this.onOutsideClick)
	},
	methods: {
		onClick (e) {
			this.disabled = false
			this.$nextTick(() => {
				e.target.focus()
				if (!this.isSearching) {
					this.inputValue = ''
					if (!this.isMultiple) this.filteredOptions = this.options
				}
				this.showOptions = true
			})
		},
		onOutsideClick (e) {
			const elem = document.getElementsByClassName('select')
			const nodes = Array.from(elem)
			if (nodes.length && !nodes.some(i => i.contains(e.target))) {
				this.showOptions = false
				this.filteredOptions = this.options
				if (this.isMultiple) {
					this.inputValue = this.multipleSelected.map(i => i.title).join(', ')
				} else this.inputValue = this.selected.title
				this.isSearching = false
			}
		},
		onFocusOut () {
			this.disabled = true
			if (this.isMultiple) {
				if (!this.isSearching) this.inputValue = this.multipleSelected.map(i => i.title).join(', ')
			} else this.inputValue = this.selected.title
		},
		onSelect (item) {
			if (this.isMultiple) {
				const checkIndex = this.multipleSelected.findIndex(i => i.id === item.id)
				if (checkIndex >= 0) {
					this.multipleSelected.splice(checkIndex, 1)
				} else this.multipleSelected = [ ...this.multipleSelected, item ]
				if (!this.isSearching) this.inputValue = this.multipleSelected.map(i => i.title).join(', ')
				this.$emit('multipleSelect', this.multipleSelected.map(i => i.id))
				// this.filteredOptions = this.options
			} else {
				this.selected = item
				this.inputValue = item.title
				this.$emit('select', item.id)
				this.showOptions = false
			}
		},
		checkSelected (id) {
			if (this.isMultiple) {
				return this.multipleSelected.some(i => i.id === id)
			} else return id === this.selected.id
		},
		onSearch (e) {
			if (e.target.value){
				if (this.isMultiple) {
					this.isSearching = true
					this.inputValue = e.target.value
				}
				this.filteredOptions = this.options.filter(i => i.title && i.title.toLowerCase().includes(e.target.value.toLowerCase()))
			} else {
				this.isSearching = false
				this.filteredOptions = this.options
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.select {
		&__head {
			position: relative;
			width: 286px;
			height: 48px;
			border: 1px solid #33393F;
			border-radius: 4px;
			background: #1F2327;
			font-size: 14px;
			line-height: 19px;
			color: rgba(#FFFFFF, 0.5);
			mix-blend-mode: normal;
			display: flex;
			align-items: center;
			//padding-left: 15px;
			cursor: pointer;

			input {
				outline: none;
				padding-right: 30px;
				border: none;
				height: 100%;
			}

			img {
				position: absolute;
				right: 18px;
				top: 50%;
				transform: translateY(-50%);
			}
		 }

		&__body {
			border: 1px solid #33393F;
			border-radius: 4px;
			max-height: 250px;
			overflow-y: auto;

			&::-webkit-scrollbar {
				width: 6px;
			}
			&::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			}
			&::-webkit-scrollbar-thumb {
				background: #7882A2;
				opacity: 0.7;
				border-radius: 2px;
			}

			&.hide {
				display: none;
			}
		}

		&__option {
			padding: 8px 15px;
			cursor: pointer;
			font-size: 14px;
			line-height: 19px;
			color: rgba(#FFFFFF, 0.5);

			&:hover {
				background: rgba(#313d4f, 0.4);
			}

			&.selected {
				background-color: rgba(#2EA2F8, 0.2);
				background-image: url("../assets/icons/tick.svg");
				background-repeat: no-repeat;
				background-position: right 18px center;
			}
		}
	}
</style>