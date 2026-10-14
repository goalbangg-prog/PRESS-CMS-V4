'use strict';

const SCREENS = [
  ['01_login.png', '사내 계정 로그인', 'account'],
  ['02_signup.png', '가입 신청', 'account'],
  ['03_password_lost.png', '비밀번호 분실 신고', 'account'],
  ['05_pending_projects.png', '승인 대기 계정의 프로젝트', 'account'],
  ['06_pending_all_projects.png', '승인 대기 계정의 전체 프로젝트', 'account'],
  ['07_pending_article_readonly.png', '승인 대기 계정의 읽기 전용 화면', 'account'],
  ['08_password_change.png', '비밀번호 변경', 'account'],
  ['09_hr_signup_list.png', '가입 신청 목록', 'hr'],
  ['10_hr_approve_dialog.png', '가입 승인과 역할 배정', 'hr'],
  ['11_hr_approved.png', '가입 승인 처리 목록', 'hr'],
  ['12_approved_dashboard.png', '승인 후 대시보드', 'account'],
  ['13_manager_ready_review_list.png', '출고 대기 기사 검토', 'workflow'],
  ['14_manager_review_mode.png', '부장 검토 모드', 'workflow'],
  ['15_media_upload_dialog.png', '미디어 등록', 'media'],
  ['16_media_library.png', '통합 미디어 라이브러리', 'media'],
  ['17_settings_ai.png', 'AI 서비스 설정', 'etc'],
  ['18_settings_general.png', '일반 환경 설정', 'etc'],
  ['19_settings_media.png', '미디어 설정', 'etc'],
  ['20_manager_project_list.png', '프로젝트 목록', 'workflow'],
  ['21_manager_work_dashboard.png', '뉴스룸 업무 대시보드', 'workflow'],
  ['22_guide.png', '사용 가이드', 'etc'],
  ['23_notification_panel.png', '업무 알림', 'workflow'],
  ['24_hr_employee_list.png', '인사부 직원 명부', 'hr'],
  ['25_hr_employee_edit_dialog.png', '직원 정보 수정', 'hr'],
  ['26_hr_departments.png', '부서 관리', 'hr'],
  ['27_hr_positions.png', '직책 관리', 'hr'],
  ['28_hr_change_log.png', '인사 변경 기록', 'hr'],
  ['29_version_history_delete.png', '기사 버전 기록', 'editor'],
  ['30_editor_feedback_highlight.png', '원문 하이라이트와 피드백', 'editor'],
  ['31_editor_ai_review_panel.png', 'AI 검수 패널', 'editor'],
  ['32_editor_infographic.png', '인포그래픽 도구', 'editor'],
  ['33_editor_ai_draft.png', '질문형 AI 초안', 'editor'],
  ['34_editor_media_panel.png', '기사 편집기와 미디어 패널', 'editor'],
  ['35_feature_mindmap.svg', '기능 마인드맵', 'diagram'],
  ['36_error_causes.svg', '오류 원인 분류', 'diagram']
];

const AI = {
  draft:{image:'33_editor_ai_draft.png', caption:'질문형 초안 작성', description:'주제와 취재 자료를 넣고 질문에 답하면 초안을 구성합니다. 기자가 확인한 뒤 본문에 적용합니다.'},
  review:{image:'31_editor_ai_review_panel.png', caption:'AI 검수 패널', description:'비문, 제목과 본문의 차이, 기사 표기 등을 확인하도록 제안합니다. 최종 확인과 반영은 기자가 결정합니다.'},
  graphic:{image:'32_editor_infographic.png', caption:'기사 수치를 활용한 인포그래픽', description:'기사 속 숫자를 추출해 차트 카드로 구성합니다. 추출한 값과 맥락을 확인한 뒤 기사에 사용합니다.'}
};
const CASES = {
  drag:{number:'01',title:'사진을 옮겼는데 복사본이 생겼다',cause:'드래그 중 자동 저장이 문서를 갱신하면서 사진의 위치 정보가 어긋났습니다.',change:'사진을 끄는 동안 저장을 보류하고, 실제 문서 변경이 있을 때 저장하도록 조정했습니다.',lesson:'사용자의 편집 동작과 백그라운드 저장의 순서를 함께 다뤄야 합니다.'},
  export:{number:'02',title:'워드 파일에서 사진이 빠졌다',cause:'임시 사진 주소를 참조하는 HTML 문서를 내보내 사진을 안정적으로 표시하지 못했습니다.',change:'사진 파일을 문서 안에 포함하는 DOCX 생성 방식을 구현했습니다.',lesson:'내보낸 파일은 원래 서비스의 접속 상태와 관계없이 내용을 담아야 합니다.'},
  refresh:{number:'03',title:'다른 창에서 돌아오면 화면이 깜빡였다',cause:'창에 복귀할 때 같은 사용자의 로그인 신호를 다시 처리해 프로필과 목록을 중복 조회했습니다.',change:'이미 열린 사용자의 중복 로그인 신호를 건너뛰고, 동일한 정보는 불필요하게 교체하지 않도록 했습니다.',lesson:'이벤트 수신과 실제 상태 변경을 구분하면 불필요한 화면 갱신을 줄일 수 있습니다.'}
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const slides = $$('.slide');
$('#pageTotal').textContent = String(slides.length);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;
let scrollScheduled = false;
let imageIndex = 0;
let imageReturnFocus = null;
const modalFocus = new WeakMap();
let galleryFilter = 'all';
let toastTimeout;

function showToast(message) {
  const box = $('#toast'); box.textContent = message; box.classList.add('show');
  window.clearTimeout(toastTimeout); toastTimeout = window.setTimeout(() => box.classList.remove('show'), 4000);
}
function syncCurrent(index) {
  current = Math.max(0,Math.min(slides.length-1,index));
  $('#pageNumber').textContent = String(current+1).padStart(2,'0');
  $('#currentTitle').textContent = slides[current].dataset.title;
  $('#progress').style.width = `${(current+1)/slides.length*100}%`;
  $('#prevButton').disabled = current===0;
  $('#nextButton').disabled = current===slides.length-1;
  $$('.rail nav a').forEach(link => {
    const active = link.dataset.group===slides[current].dataset.group;
    link.classList.toggle('active',active);
    if(active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
}
function detectCurrent() {
  const top = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar')) || 62;
  let best = 0;
  slides.forEach((slide,index) => {if(slide.getBoundingClientRect().top <= top + window.innerHeight*.32) best=index;});
  syncCurrent(best); scrollScheduled=false;
}
function goTo(index) {
  const next = Math.max(0,Math.min(slides.length-1,index));
  syncCurrent(next);
  slides[next].scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});
  try {history.replaceState(null,'',`#${slides[next].id}`);} catch (_) { /* file URLs may limit history */ }
}
window.addEventListener('scroll',() => {if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(detectCurrent);}},{passive:true});
window.addEventListener('resize',detectCurrent);
$$('a[href^="#"]').forEach(link => link.addEventListener('click',event => {
  const id=link.getAttribute('href').slice(1); const index=slides.findIndex(slide=>slide.id===id);
  if(index>=0){event.preventDefault();goTo(index);}
}));
$('#prevButton').addEventListener('click',()=>goTo(current-1));
$('#nextButton').addEventListener('click',()=>goTo(current+1));

function modalOpen(dialog) {
  if(dialog.open) return;
  modalFocus.set(dialog, document.activeElement);
  dialog.showModal(); document.body.classList.add('modal-open');
}
function modalClose(dialog) {
  dialog.close();
  if(!$$('dialog[open]').length) document.body.classList.remove('modal-open');
}
$$('dialog').forEach(dialog => {
  $$('[data-close]',dialog).forEach(button=>button.addEventListener('click',()=>modalClose(dialog)));
  dialog.addEventListener('close',()=>{
    if(!$$('dialog[open]').length) document.body.classList.remove('modal-open');
    if(dialog.id==='lightbox' && imageReturnFocus?.isConnected) imageReturnFocus.focus();
    else if(modalFocus.get(dialog)?.isConnected) modalFocus.get(dialog).focus();
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) modalClose(dialog);
  });
});
function showImage(file) {
  const index=SCREENS.findIndex(screen=>screen[0]===file);
  if(index<0) return;
  imageIndex=index; imageReturnFocus=document.activeElement;
  updateImage(); modalOpen($('#lightbox'));
}
function updateImage() {
  const [file,title,category] = SCREENS[imageIndex];
  $('#lightboxImage').src=`assets/${file}`;
  $('#lightboxImage').alt=title;
  $('#lightboxTitle').textContent=title;
  $('#lightboxCount').textContent=`${String(imageIndex+1).padStart(2,'0')} / ${SCREENS.length}`;
  $('#lightboxCaption').textContent=category==='diagram'?'팀원 발표자료에서 통합한 도표':'첨부한 실제 실행 화면';
  $('#lightboxImageWrap').classList.remove('actual');
  $('#zoomButton').setAttribute('aria-pressed','false');
  $('#zoomButton').textContent='원본 크기';
  $('#lightboxPrev').disabled=imageIndex===0;
  $('#lightboxNext').disabled=imageIndex===SCREENS.length-1;
}
function changeImage(offset) {imageIndex=Math.max(0,Math.min(SCREENS.length-1,imageIndex+offset));updateImage();}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-image]');
  if(button) showImage(button.dataset.image);
});
$('#lightboxPrev').addEventListener('click',()=>changeImage(-1));
$('#lightboxNext').addEventListener('click',()=>changeImage(1));
$('#zoomButton').addEventListener('click',()=>{
  const actual=$('#lightboxImageWrap').classList.toggle('actual');
  $('#zoomButton').setAttribute('aria-pressed',String(actual));
  $('#zoomButton').textContent=actual?'화면에 맞춤':'원본 크기';
});
$('#lightbox').addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'){event.preventDefault();event.stopPropagation();changeImage(1);}
  if(event.key==='ArrowLeft'){event.preventDefault();event.stopPropagation();changeImage(-1);}
});

function renderGallery(filter='all') {
  galleryFilter=filter; const grid=$('#galleryGrid'); grid.replaceChildren();
  SCREENS.filter(screen=>filter==='all'||screen[2]===filter).forEach(([file,title])=>{
    const button=document.createElement('button');button.className='gallery-item';button.dataset.image=file;
    const img=document.createElement('img');img.src=`assets/${file}`;img.alt=title;img.loading='lazy';
    const caption=document.createElement('span');caption.textContent=title;
    button.append(img,caption);grid.append(button);
  });
  $$('[data-filter]').forEach(button=>{
    const selected=button.dataset.filter===filter;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
  });
}
function openGallery(){renderGallery(galleryFilter);modalOpen($('#gallery'));}
$('#galleryButton').addEventListener('click',openGallery);
$$('[data-open-gallery]').forEach(button=>button.addEventListener('click',openGallery));
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>renderGallery(button.dataset.filter)));

function openOverview(){
  const grid=$('#overviewGrid');grid.replaceChildren();
  slides.forEach((slide,index)=>{
    const button=document.createElement('button');button.classList.toggle('current',index===current);
    const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
    const title=document.createElement('b');title.textContent=slide.dataset.title;button.append(number,title);
    button.addEventListener('click',()=>{modalClose($('#overview'));goTo(index);});grid.append(button);
  });
  modalOpen($('#overview'));
}
$('#overviewButton').addEventListener('click',openOverview);

function selectAi(key){
  const data=AI[key];if(!data)return;
  $('#aiImage').src=`assets/${data.image}`;$('#aiImage').alt=data.caption;$('#aiImageButton').dataset.image=data.image;
  $('#aiCaption').textContent=data.caption;$('#aiDescription').textContent=data.description;$('#ai-panel').setAttribute('aria-labelledby',`ai-tab-${key}`);
  $$('[data-ai]').forEach(button=>{const active=button.dataset.ai===key;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
}
$$('[data-ai]').forEach(button=>button.addEventListener('click',()=>selectAi(button.dataset.ai)));
function selectCase(key){
  const data=CASES[key];if(!data)return;
  ['Number','Title','Cause','Change','Lesson'].forEach(field=>{$(`#case${field}`).textContent=data[field.toLowerCase()];});
  $('#case-panel').setAttribute('aria-labelledby',`case-tab-${key}`);
  $$('[data-case]').forEach(button=>{const active=button.dataset.case===key;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
}
$$('[data-case]').forEach(button=>button.addEventListener('click',()=>selectCase(button.dataset.case)));
$$('[role="tablist"]').forEach(list=>list.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
  const tabs=$$('[role="tab"]',list);let index=tabs.indexOf(document.activeElement);if(index<0)return;
  event.preventDefault();event.stopPropagation();
  if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else index=(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length;
  tabs[index].click();tabs[index].focus();
}));
$$('[data-history]').forEach(button=>button.addEventListener('click',()=>{
  const isVersion=button.dataset.history==='version';
  const file=isVersion?'29_version_history_delete.png':'23_notification_panel.png';const caption=isVersion?'기사 버전 기록':'업무 알림';
  $('#historyImage').src=`assets/${file}`;$('#historyImage').alt=caption;$('#historyImageButton').dataset.image=file;$('#historyCaption').textContent=caption;
  $$('[data-history]').forEach(choice=>{const active=choice===button;choice.classList.toggle('active',active);choice.setAttribute('aria-pressed',String(active));});
}));

async function toggleFullscreen(){
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
    else showToast('이 브라우저에서는 F11 또는 브라우저 전체 화면 기능을 사용해 주세요.');
  }catch(_){showToast('브라우저의 전체 화면 기능(F11)을 사용해 주세요.');}
}
$('#fullscreenButton').addEventListener('click',toggleFullscreen);
document.addEventListener('fullscreenchange',()=>{$('#fullscreenButton').textContent=document.fullscreenElement?'전체 화면 종료 ⛶':'전체 화면 ⛶';});
$('#printButton').addEventListener('click',()=>{
  $$('img[loading="lazy"]').forEach(img=>img.loading='eager');
  const waits=$$('main img').map(img=>img.decode?.().catch(()=>{})||Promise.resolve());
  Promise.all(waits).then(()=>window.print());
});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  const open=$$('dialog[open]');
  if(open.length) return;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)){
    if(event.key===' ' && event.target.closest('button,a,summary'))return;event.preventDefault();goTo(current+1);
  }else if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();goTo(current-1);}
  else if(event.key==='Home'){event.preventDefault();goTo(0);}
  else if(event.key==='End'){event.preventDefault();goTo(slides.length-1);}
  else if(event.key.toLowerCase()==='f'){event.preventDefault();toggleFullscreen();}
  else if(event.key.toLowerCase()==='g'){event.preventDefault();openGallery();}
  else if(event.key.toLowerCase()==='o'){event.preventDefault();openOverview();}
});

// Keep the downloaded presentation independent of hosting and network requests.
if(location.protocol==='file:'){
  $$('a[download][href$=".zip"]').forEach(link=>link.hidden=true);
}
document.addEventListener('DOMContentLoaded',()=>{
  const index=slides.findIndex(slide=>`#${slide.id}`===location.hash);
  if(index>=0)syncCurrent(index);else detectCurrent();
});
syncCurrent(0);
