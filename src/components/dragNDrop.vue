<template>
<div class="drag-n-drop" v-if="!isMobile()">
    <div></div>
    <div class="main-selection">
        <draggable
        class="list-group"
        :list="mainList"
        group="answers"
        :move="checkMove"
        @change="log"
        @end="onEnd"
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
            <h4>{{dragBoxOneTitle}}<span v-if="leftList.length>0">({{leftList.length}})</span></h4>
            <draggable
                class="list-group"
                :class="dragging?'list-group-drag':''"
                :list="leftList"
                @change="log"
                group="answers"
                :disabled=drag
                itemKey="name"
                @end="drag"
            >
                <template #item="{ element, index }">
                <div :class="! element.validity ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="close-btn fa fa-close"></i></div>
                </template>
            </draggable>
        </div>

    <div class="question-section-item">
      <h4>{{dragBoxTwoTitle}}<span v-if="rightList.length>0">({{rightList.length}})</span> </h4>
      <draggable
        class="list-group"
        :class="dragging?'list-group-drag':''"
        :list="rightList"
        group="answers"
        @change="log"
        @end="drag"
        :disabled=drag
        itemKey="name">
        <template #item="{ element, index }">
          <div  :class="! element.validity ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteRightList(element)" class="close-btn fa fa-close"></i> </div>
        </template>
      </draggable>
    </div>
  </div>
    <div class="answer-section">
            <div v-if="validate" :class=" !isErrorAvaiable ? 'answer-title' :'answer-title error'"> {{answerTitle}} </div>
            <div v-if="validate" class="answer-description">{{answerDescription}}</div>
          <div><a  class="continuebtn" @click="submit()" v-if="!validate"> Check Answer</a></div>
        </div>
      
</div>
<div class="drag-n-drop" v-if="isMobile()">
    <div class="main-selection">
      <div class="list-group">
        <div class="" v-for="element in mainList" :key="element.keyword">
          <div class="list-group-item" :class="element.selected? 'selected' :'' " @click="selectItem(element)">{{ element.keyword }} </div>
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
                    <div :class="! element.error ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="close-btn fa fa-close"></i></div>
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
                    <div :class="! element.error ?'list-group-item' : 'list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="close-btn fa fa-close"></i></div>
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
import questionDataApi from '../services/QuestionsDataAPI'
const questionId = document.querySelector("#question-id").value;
const nextQuestionId = document.querySelector("#nextqid").value;

export default {
    components: {
            draggable,
        },
  data() {
    return {
        count: 0,
        selectedItems :[],
        drag: false,
        mainList: [],
        leftList: [],
        rightList:[],
        leftToggle: false,
        rightToggle: false,
        totalItemSize :0,
        validate :false,
        rawData :{},
        dragging:false,
        dragBoxOneTitle :"",
        dragBOxTwoTitle : '',
        title :"",
        answerDescription:""
       

        
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

  methods: {
    checkMove(){
        this.dragging =true;
    },
    onEnd(){
        this.dragging =false;
    },
    toggleLeft(){
        this.leftToggle = !this.leftToggle
    },
    toggleRight(){
        this.rightToggle = !this.rightToggle
    },
    selectItem(element){
        element.selected = !element.selected;
        this.leftToggle = false
        this.rightToggle = false
        if(!this.selectedItems.some( el=>  el.keyword==element.keyword))  
        {
             this.selectedItems.push(element);
        }else{
           this.selectedItems= this.selectedItems.filter(ele => ele.keyword !=element.keyword)
        }
       
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
            element.KeywordBelongsTo = 'box_1'
            // if (element.KeywordBelongsTo != 'box_1') {
            //     element.error = true;
            // }
        });
        this.rightList.forEach(element => {
            // if (element.KeywordBelongsTo != 'box_2') {
            //     element.error = true;
            // }

            element.KeywordBelongsTo = 'box_2'
        });
        let payload ={};
        payload.classification_q_id =questionId;
        payload.drag_column_box_1 = this.leftList
        payload.drag_column_box_2 = this.rightList


        questionDataApi.postData(payload, res => {
            if(res.status ==200){
            console.log(res.data);
            this.leftList = res.data.drag_column_box_1;
            this.rightList = res.data.drag_column_box_2;
            this.answerDescription = res.data.answer_description;
            if(nextQuestionId>0) 
            document.querySelector("#next-wrap").classList.remove("d-none");


            this.validate =true
            this.drag = true;
            }
        
          },  res => {
            console.log('error in get API', res)
          })


        

    },
    originalMainListSize(id) {
        return this.mainList.length;
    },
    getData(id) {
        return this.rawData.classification.find(element => { return element.classification_q_id == id });
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

  mounted() {
          questionDataApi.getData('', res => {
            if(res.status ==200){
            this.rawData = res.data;
            let dataSet = this.findReleventClassification(questionId);
            this.mainList= dataSet.drag_column;
            this.dragBoxOneTitle =dataSet.drag_box_1_title;
            this.dragBoxTwoTitle =dataSet.drag_box_2_title;
            this.title = dataSet.title

            this.totalItemSize = this.originalMainListSize(questionId);
            }
        
          },  res => {
            console.log('error in get API', res)
          })

  }
}
</script>

<style lang="scss">


.drag-n-drop{
    .title{
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        font-size: 14px;
    }
    .main-selection{
        .count{
            float: right;
            color:#808284;
            font-size: 11px;
            padding: 10px
        }
        .list-group{

            display: flex;
            flex-wrap: wrap;
            background: #104c97;
            padding: 20px;
            border-radius: 8px;
            .selected{
                background-color: rgb(39, 199, 252) !important;
            }
            .list-group-item{
                padding: 10px;
                border-radius: 4px;
                margin: 5px;
                font-size: 13px;
                font-weight: bold;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                background: white;
                cursor: grab;
                .close-btn{
                    cursor: default;
                }
            }
           
        }
       
    }
    .question-sections{
        margin-top: 30px;
        display: flex;
         border-radius: 8px;
       
        // flex-direction: row;
        .question-section-item{
            h4{
                text-align: left;
                padding: 0 10px;
            }
            flex: 1;
            .list-group{
                display: flex;
                flex-wrap:wrap;
                align-content: flex-start;
                height: 300px;
                border-radius: 8px;
                border: dashed 1px #b7b7b7;
                background-color: #fff;
                padding: 20px;
               
            .list-group-item{
                padding: 10px;
                border-radius: 4px;
                margin: 5px;
                font-size: 13px;
                height: fit-content;
                font-weight: bold;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                background: white;
                cursor: grab;
                .close-btn{
                    cursor: default;
                }

            }
            .error{
              background-color:darkred;
              color: white;
            }
           
        }
        .list-group-drag{
              background-color: #f3f3f3
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