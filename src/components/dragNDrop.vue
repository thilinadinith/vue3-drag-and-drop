<template>
<div class="drag-n-drop" v-if="!isMobile()">
    <div class="main-selection">
        <draggable
        class="list-group"
        :list="mainList"
        group="answers"
        @change="log"
        :disabled="drag"
        itemKey="keyword"
      >
        <template #item="{ element, index }">
          <div class="list-group-item">{{ element.keyword }} </div>
        </template>
      </draggable>
         <div class="count">{{itemsAvaiable}}/{{totalItemSize}}</div>
    </div>
 

    <div class="question-sections">
        <div class="question-section-item">
            <h3>Draggable 1</h3>
            <draggable
                class="list-group"
                :list="leftList"
                @change="log"
                group="answers"
                :disabled=drag
                itemKey="name"
                @end="drag"
            >
                <template #item="{ element, index }">
                <div :class="! element.error ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="fa fa-close"></i></div>
                </template>
            </draggable>
        </div>

    <div class="question-section-item">
      <h3>Draggable 2</h3>
      <draggable
        class="list-group"
        :list="rightList"
        group="answers"
        @change="log"
        @end="drag"
        :disabled=drag
        itemKey="name">
        <template #item="{ element, index }">
          <div class="list-group-item">{{ element.keyword }} <i v-if="!validate" @click="deleteRightList(element)" class="fa fa-close"></i> </div>
        </template>
      </draggable>
    </div>
  </div>
    <div class="answer-section">
            <div v-if="validate" :class=" !isErrorAvaiable ? 'answer-title' :'answer-title error'"> {{answerTitle}} </div>
            <div v-if="validate" class="answer-description"> SKIPPING OPTIONAL DEPENDENCY: esbuild-windows-64@0.14.27 (node_modules/esbuild-windows-64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for esbuild-windows-64@0.14.27: wanted {"os":"win32","arch":"x64"} (current: {"os":"darwin","arch":"x64"})</div>
          <div><a  class="continuebtn" @click="submit()"> Continue</a></div>
        </div>
      
</div>
<div class="drag-n-drop" v-if="isMobile()">
    <div class="main-selection">
      <div class="list-group">
        <div class="" v-for="element in mainList" :key="element.keyword">
          <div class="list-group-item" @click="selectItem(element)">{{ element.keyword }} </div>
      </div>
    </div>
      <div class="count">{{itemsAvaiable}}/{{totalItemSize}}</div>
    </div>
    <div class="question-sections" >
        <div class="mobile-question-item">
            <div class="title-mobile"> this is left list <i class="fa" :class="leftToggle ? 'fa-angle-up' :'fa-angle-down'" @click="toggleLeft()"></i> </div>
            <div class="add-button"  v-if="selectedItems.length>0" @click='addItemsLeft()'> tap and drop here</div>
            <div class="list-group" v-show="leftList.length>0 && leftToggle">
                <div  v-for="element in leftList" :key="element.keyword" >
                    <div :class="! element.error ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="fa fa-close"></i></div>
                </div>
            </div>
            <div  class="list-group" v-show="leftList.length==0 && leftToggle" >
                    <div class="empty-message">click and drop here</div>
            </div>
        </div>
        <div class="mobile-question-item">
            <div class="title-mobile"> this is left list <i class="fa" :class="rightToggle ? 'fa-angle-up' :'fa-angle-down'" @click="toggleRight()"></i> </div>
            <div class="add-button"  v-if="selectedItems.length>0" @click='addItemsLeft()'> tap and drop here</div>
            <div class="list-group" v-show="rightList.length>0 && leftToggle">
                <div  v-for="element in rightList" :key="element.keyword" >
                    <div :class="! element.error ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="fa fa-close"></i></div>
                </div>
            </div>
            <div  class="list-group" v-show="rightList.length==0 && rightToggle" >
                    <div class="empty-message">click and drop here</div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import draggable from 'vuedraggable'
import dataJson from '../../data.json'

export default {
    components: {
            draggable,
        },
  // Properties returned from data() becomes reactive state
  // and will be exposed on `this`.

  data() {
    return {
        count: 0,
        selectedItems :[],
        drag: false,
        mainList: this.findReleventClassification(560),
        leftList: [],
        rightList:[],
        leftToggle: false,
        rightToggle: false,
        totalItemSize : this.originalMainListSize(560),
        validate :false
       

        
    }
  },
  computed:{
      
       itemsAvaiable () {
          return this.mainList.length
       } ,
        isErrorAvaiable () {
            return  this.leftList.some( el=>  el.error==true) ||this.rightList.some( el=>  el.error==true)  
        } ,
        answerTitle(){
            return this.isErrorAvaiable? 'You are not correct' : 'You are correct'
        }
  },


  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event listeners in templates.
  methods: {
    toggleLeft(){
        this.leftToggle = !this.leftToggle
    },
    toggleRight(){
        this.rightToggle = !this.rightToggle
    },
    selectItem(element){
        this.leftToggle = false
        this.rightToggle = false
        if(!this.selectedItems.some( el=>  el.keyword==element.keyword))  
        this.selectedItems.push(element);
    },
    addItemsLeft(){
        this.selectedItems.forEach(el => {
            this.leftList.push(el);
            this.mainList = this.mainList.filter(ele => ele.keyword !=el.keyword)
        })
        this.leftToggle = true;
        this.rightToggle = true;
        this.selectedItems = [];
    },
    addItemsRight(){
        this.selectedItems.forEach(el => {
            this.rightList.push(el);
            this.mainList = this.mainList.filter(ele => ele.keyword !=el.keyword)
        })
        this.selectedItems = [];
    },
    isMobile() {return  window.innerWidth <= 760 },
    findReleventClassification(id) {
        return this.getData(id)
    },
    submit() {
        this.leftList.forEach(element => {
            if (element.KeywordBelongsTo != 'box_1') {
                element.error = true;
            }
        });
        this.rightList.forEach(element => {
            if (element.KeywordBelongsTo != 'box_2') {
                element.error = true;
            }
        });
        this.validate = true;
        this.drag = true;

    },
    originalMainListSize(id) {
        return this.getData(id).length;
    },
    getData(id) {
        return dataJson.classification.find(element => { return element.classification_q_id == id }).drag_column
    },
    increment() {
        this.count++
    },
    deleteRightList(element) {
        this.rightList = this.deleteItem(this.rightList, element)
    },
    deleteLeftList(element) {
        this.leftList = this.deleteItem(this.leftList, element)
    },
    deleteItem(list, element) {
        this.mainList.unshift(element);
        return list.filter(el => el.keyword != element.keyword)
    }
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    console.log(`The initial count is ${this.count}.`);
  }
}
</script>

<style lang="scss">

.drag-n-drop{
    .main-selection{
        .count{
            float: right;
        }
        .list-group{

            display: flex;
            flex-wrap: wrap;
            background: rgb(38, 38, 133);
            padding: 20px;
            .list-group-item{
                padding: 10px;
                border-radius: 10px;
                margin: 5px;
                font-weight: bold;
                background: white;
            }
           
        }
       
    }
    .question-sections{
        margin-top: 30px;
        display: flex;
        // flex-direction: row;
        .question-section-item{
            flex: 1;
            .list-group{
                display: flex;
                flex-wrap:wrap;
                background: lightgray;
                align-content: flex-start;
                height: 300px;
                border-radius: 10px;
                padding: 20px;
            .list-group-item{
                padding: 10px;
                border-radius: 10px;
                margin: 5px;
                height: fit-content;
                font-weight: bold;
                background: white;

            }
            .error{
              background-color:darkred;
              color: white;
            }
           
        }
        }
        .question-section-item:first-child {
            margin-right: 20px;
        } 
       
    }
    .answer-section{
        padding: 20px;

        .answer-title{
            color:lightgreen;
            text-align: left;
            font-weight: bold;
        }
        .error{
            color:red
        }
        .answer-description{
            background: lightgray;
            padding: 20px;
            border-radius: 10px;
            margin: 10px 0px;
            text-align: left;

        }

        .continuebtn {
            float: right;
            box-shadow:inset 0px 0px 15px 3px #23395e;
            background-color:#2e466e;
            border-radius:20px;
            display:inline-block;
            cursor:pointer;
            color:#ffffff;
            font-family:Arial;
            font-size:15px;
            padding:10px 25px;
            text-decoration:none;
            text-shadow:0px 1px 0px #263666;
            margin: 10px;
        }
         .continuebtn :hover {
            background-color:#415989;
        }
        .continuebtn:active {
            position:relative;
            top:1px;
        }

                
    }
}
@media only screen and (max-width: 600px) {
.drag-n-drop{
    margin: 10px;
    main-selection{

    }
}
.question-sections{
    display: block !important;
    .mobile-question-item{
            margin-bottom: 30px;
            .title-mobile{
                border-style: solid;
                border-width: 0.5px;
                padding: 20px;
                border-radius: 10px;
                text-align: left;
                font-weight: bold;
                i {
                    float: right;
                }
            }
            .add-button{
                border-style: dashed;
                padding: 10px;
                border-radius: 10px;
                border-color: #3954a7;
            }
            .list-group{
                        display: flex;
                        flex-wrap:wrap;
                        background: lightgray;
                        align-content: flex-start;
                        min-height: 100px;
                        border-radius: 10px;
                        padding: 20px;
                    .list-group-item{
                        padding: 10px;
                        border-radius: 10px;
                        margin: 5px;
                        height: fit-content;
                        font-weight: bold;
                        background: white;

                    }
                    .empty-message{
                        text-align: center;
                        margin: auto;
                        margin-top: 20px;
                    }
            }

    }
 
}

}
</style>