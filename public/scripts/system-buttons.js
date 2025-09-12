(function(){
  function handlePolaczek(){
    try{ localStorage.setItem('systemAction','polaczek') }catch(e){}
    window.open('/system-polaczek','_blank');
  }
  function handleBielik(){ try{ localStorage.setItem('systemAction','bielik') }catch(e){}; window.open('/system-bielik','_blank'); }
  function handleZenon(){ try{ localStorage.setItem('systemAction','zenon') }catch(e){}; window.open('/system-zenon','_blank'); }
  function handleKlf(){ try{ localStorage.setItem('systemAction','klf') }catch(e){}; window.open('/system-klf','_blank'); }
  function openAgentBuilder(){ try{ localStorage.setItem('systemAction','agent_builder') }catch(e){}; window.open('/agent-builder','_blank'); }
  window.handlePolaczek = handlePolaczek;
  window.handleBielik = handleBielik;
  window.handleZenon = handleZenon;
  window.handleKlf = handleKlf;
  window.openAgentBuilder = openAgentBuilder;
})();
