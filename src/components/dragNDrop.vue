<template>
<div class="drag-n-drop" v-if="!isMobile()">
    <div></div>
    <div class="main-selection">
        <div class="drag-section"> 
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
                <div class="dragdrop-list-group-item">{{ element.keyword }} </div>
                </template>
            </draggable>
             <div class="empty" v-if="mainList.length==0 && (leftList.length>0 || rightList.length>0)">You’ve done sorting all the options!</div>
        </div>
      <div class="main-section-footer">
            <div class="popper-section">
                <Popper arrow
                offsetDistance=0
                offsetSkid=140
                    :content="howItWorks">
                    <div><i class="fa fa-question-circle-o "></i> <span class="how-it-works"> How it works </span></div>
                </Popper>
            </div>
            <div class="count">{{itemsAvaiable}}/{{totalItemSize}}</div>
      </div>
    </div>
 

    <div class="question-sections">
        <div class="question-section-item">
            <h4>{{dragBoxOneTitle}} <span class='box-count' v-if="leftList.length>0">({{leftList.length}})</span></h4>
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
                <div :class="element.validity ||element.validity ==undefined ?'dragdrop-list-group-item' : 'dragdrop-list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="close-btn fa fa-close"></i></div>
                </template>
            </draggable>
        </div>

    <div class="question-section-item">
      <h4>{{dragBoxTwoTitle}}<span class='box-count'  v-if="rightList.length>0">({{rightList.length}})</span> </h4>
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
          <div  :class="element.validity ||element.validity ==undefined ?'dragdrop-list-group-item' : 'dragdrop-list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteRightList(element)" class="close-btn fa fa-close"></i> </div>
        </template>
      </draggable>
    </div>
  </div>
    <div class="answer-section">
            <div v-if="validate" :class=" !isErrorAvaiable ? 'answer-title' :'answer-title error'" v-html="answerTitle">  </div>
            <div v-if="validate" class="answer-description">{{answerDescription}}</div>
          <div><a  class="continuebtn" @click="submit()" :class="(mainList.length>0)?'disabled':''" v-if="!validate"> Check Answer</a></div>
        </div>
      
</div>
<div class="drag-n-drop" v-if="isMobile()">
    <div class="main-selection">
      <div class="list-group">
         <Carousel  v-if="sliderList.length!==0" :itemsToShow="1">
            
            <Slide v-for="(elements, index) in sliderList" :key="index">
            <div class="carousel__item" style="display:flex; flex-wrap:wrap;">
                 <div v-for="(element, index) in elements" :key="index" class="dragdrop-list-group-item" :class="element.selected? 'selected' :'' " @click="selectItem(element)">{{ element.keyword }} </div>       
            </div>
            </Slide>
            <template #addons>
            <Navigation />
            <Pagination />
            </template>
        </Carousel>
       
  
    </div>
       <div class="main-section-footer">
            <div class="popper-section">
                <Popper arrow
                offsetDistance=0
                offsetSkid=140
                    :content="howItWorks">
                    <div><i class="fa fa-question-circle-o "></i> <span class="how-it-works"> How it works </span></div>
                </Popper>
            </div>
            <div class="count">{{itemsAvaiable}}/{{totalItemSize}}</div>
      </div>
    </div>
    <div class="question-sections" >
        <div class="mobile-question-item">
            <div class="title-mobile"> this is left list <i class="fa" :class="leftToggle ? 'fa-angle-up' :'fa-angle-down'" @click="toggleLeft()"></i> </div>
            <div class="add-button"  v-if="selectedItems.length>0" @click='addItemsLeft()'> tap and drop here</div>
            <div class="list-group" v-show="leftList.length>0 && leftToggle">
                <div  v-for="element in leftList" :key="element.keyword" >
                    <div :class="element.validity ||element.validity ==undefined ?'dragdrop-list-group-item' : 'dragdrop-list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="close-btn fa fa-close"></i></div>
                </div>
            </div>
            <div  class="list-group" v-show="leftList.length==0 && leftToggle" >
                    <div class="empty-message">click and drop here</div>
            </div>
        </div>
        <div class="mobile-question-item">
            <div class="title-mobile"> this is left list <i class="fa" :class="rightToggle ? 'fa-angle-up' :'fa-angle-down'" @click="toggleRight()"></i> </div>
            <div class="add-button"  v-if="selectedItems.length>0" @click='addItemsRight()'> tap and drop here</div>
            <div class="list-group" v-show="rightList.length>0 && leftToggle">
                <div  v-for="element in rightList" :key="element.keyword" >
                    <div :class="element.validity ||element.validity ==undefined ?'dragdrop-list-group-item' : 'dragdrop-list-group-item error'">{{ element.keyword }} <i v-if="!validate" @click="deleteLeftList(element)" class="close-btn fa fa-close"></i></div>
                </div>
            </div>
            <div  class="list-group" v-show="rightList.length==0 && rightToggle" >
                    <div class="empty-message">click and drop here</div>
            </div>
        </div>
    </div>

       <div class="answer-section">
            <div v-if="validate" :class=" !isErrorAvaiable ? 'answer-title' :'answer-title error'" v-html="answerTitle">  </div>
            <div v-if="validate" class="answer-description">{{answerDescription}}</div>
          <div><a  class="continuebtn" @click="submit()" :class="(mainList.length>0)?'disabled':''" v-if="!validate"> Check Answer</a></div>
        </div>
</div>
</template>
<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import draggable from 'vuedraggable'
import Popper from "vue3-popper";
import dataJson from '../../data.json'
import questionDataApi from '../services/QuestionsDataAPI'
const questionId = document.querySelector("#question-id").value;
const nextQuestionId = document.querySelector("#nextqid").value;

export default {
    components: {
            draggable,
            Popper,
            Carousel,
            Slide,
            Pagination,
            Navigation,
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
        answerDescription:"",
        howItWorks :""
       

        
    }
  },
  computed:{

        sliderList(){
            let sliderList =[]
            let i=0;
            let j=0;
            while( this.mainList.length!=i && this.mainList.length >0){
                let element = this.mainList[i];
                if(i%5==0){
                    sliderList[j]=[];
                    sliderList[j].push(element)
                    j++;
                }else{
                    sliderList[j-1].push(element)
                }
                i++;
            }
            return sliderList;
        }
      ,
       itemsAvaiable () {
          return this.mainList.length
       } ,
        isErrorAvaiable () {
            return  this.leftList.some( el=>  el.validity==false) ||this.rightList.some( el=>  el.validity==false)  
        } ,
        answerTitle(){
            return this.isErrorAvaiable? '<span class="fa-stack"><i class="fa fa-circle-o fa-stack-1x wrong-answer-icon "></i> <i class="fa fa-close fa-stack-1x "></i></span>  You are not correct' : '<span><i class="fa fa-check-circle-o wrong-answer-icon "></i> </span><span>You are correct</span>'
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
        this.leftToggle = true;
        this.rightToggle = true;
        this.selectedItems = [];
    },
    isMobile() {return  window.innerWidth <= 760 },
    findReleventClassification(id) {
        return this.getData(id)
    },
    submit() {
        if(this.mainList.length>0)return;

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
            else{
                document.querySelector("#next-question").value = 'View Result';
                document.querySelector("#next-question").classList.add("result");
                document.querySelector("#next-wrap").classList.remove("d-none");
            }


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
        element.selected ? element.selected=false:'';
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
            this.howItWorks = dataSet.how_it_works

            this.totalItemSize = this.originalMainListSize(questionId);
            }
        
          },  res => {
            console.log('error in get API', res)
          })

  }
}
</script>

<style lang="scss">
:root {
    --vc-clr-primary: #e5e5e5;
    --vc-clr-secondary: #e5e5e5;
    }

.drag-n-drop{
    .title{
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        font-size: 14px;
    }
    .main-selection{
        .drag-section{
            background-color: #104c97;
            border-radius: 8px;
            .empty{
                padding-bottom: 30px;
                color: white;
                font-weight: bold;
            }
        }
        .count{
            float: right;
            color:#808284;
            font-size: 11px;
            padding: 10px
        }
    
        .main-section-footer{
            display: flex;
            align-items: center;
            flex-flow: row;
            .popper{
                padding: 9px 18px 11px;
                border-radius: 4px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                border: solid 1px #e5e5e5;
                color: black;
                margin: 0px 10px  !important;
                background-color: #fff;
            }
            .how-it-works{
                padding: 10px 0px;
                cursor: default;
            }
            .popper-section{
                font-size: 14px;
                color: #104c97;
                padding: 10px;
                text-align: left;
                flex: 1;
                
                .inline-block{
                    &::after{
                    display: block;
                }
            }
        }
        }
     
        .list-group{

            display: flex;
            flex-wrap: wrap;
            background: #104c97;
            padding: 20px;
            border-radius: 8px;
            flex-direction: unset;
            .selected{
                background-color: rgb(39, 199, 252) !important;
                color: white;
            }
            .dragdrop-list-group-item{
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
                flex-direction: unset;
               
            .dragdrop-list-group-item{
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
        .box-count{
            padding: 0px 10px;
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
        padding: 20px 0px;
  
  
        .answer-title{
            color:#76b14d;
            text-align: left;
            font-weight: bold;
        }
        .error{
            color:#ab121a
        }
        .wrong-answer-icon{
            font-size: 24px;
            vertical-align: middle;
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
       
        .disabled{
            background-color: #d9d9d9;
            text-shadow: none;
            box-shadow : none;
        }
         .disabled :hover {
            background-color: #d9d9d9 !important;
             color:white !important;
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
    .main-selection{
        .list-group{
            .empty{
                margin: auto;
                color: white;
                font-weight: bold;
            }
        }
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

                    .dragdrop-list-group-item{
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
                    

            .error{
                background-color:darkred;
                color: white;}
        

            }

    }
 
}
.carousel__prev--in-active, .carousel__prev , .carousel__next,
.carousel__next--in-active {
  display: none;
}
.carousel__pagination{
    padding: 0px;
}
.carousel{
    width: 100%;
}
.carousel__pagination-button{
    height: 8px;
    width: 8px;
    border-radius: 50%;
    padding: 0px;
    opacity: 0.2;
}
.carousel__pagination-button--active{
    opacity: 1;
}

}
</style>