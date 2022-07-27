let setintervalparams = {
    width: 1,
    id: ''
  }
  let host = location.protocol.concat('//').concat(window.location.hostname)
  let socket = io.connect()
  socket.on('news', function (data) {
    var then = new Date()
  
    clearInterval(setintervalparams.id)
  
    var loop = setintervalparams.width
  
    var ids = setInterval(function () {
      loop++
      if (loop === 101) {
        clearInterval(ids)
        loop = 0
        setintervalparams.width = 0
        $('#uploadsavemsg').html(data + ' records are inserted ! ')
      } else {
        $('#lbluploadprogress').html(loop + '%')
        $('#dvuploadprogress').css('width', loop + '%')
        $('#uploadsave').html(loop + '%')
      }
    }, 20)
  })
  socket.on('newsdownloadsets', function (data) {
    var filenome = data.replace('.csv', '')
    clearInterval(setintervalparams.id)
    var loop = setintervalparams.width
  
    var ids = setInterval(function () {
      loop++
      if (loop === 101) {
        clearInterval(ids)
        loop = 0
        setintervalparams.width = 0
        $('#libasenotifications').hide()
        $('#libasenotificationrow').show()
        $('#spn_dv' + filenome).hide()
        $('#dv_set_progress' + filenome).before(
          '<a href="../exportCsv/' +
            data +
            '"><i class="fa fa-download text-aqua"></i> <span  style="white-space: normal !important;">' +
            data +
            '</span></a>'
        )
        $('#uploadsave').hide()
      } else {
        $('#uploadsave').show()
        $('#lbluploadprogress' + filenome + '').html(loop + '%')
        $('#dvuploadprogress' + filenome + '').css('width', loop + '%')
        $('#uploadsave').html(loop + '%')
      }
    }, 20)
  })
  socket.on('newsdownload', function (data) {
    socket.emit('end')
  })
  socket.on('newsdownloadsetprogressstats', function (data) {
    $('#libasenotifications').hide()
    $('#libasenotificationrow').show()
  
    var filenames = data.filenames
    var count = data.count <= 0 ? 40 : parseInt(data.count)
  
    $('#libasenotificationrow').append(
      '<span style="color: #28669c;" id="spn_dv' +
        filenames +
        '">Data processing in progress !</span><div id="dv_set_progress' +
        filenames +
        '"><small class="pull-right"><label id="lbluploadprogress' +
        filenames +
        '">%</label></small>' +
        '<div class="progress xs">' +
        '<div class="progress-bar progress-bar-aqua" id="dvuploadprogress' +
        filenames +
        '" style="width: 20%;" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">' +
        '</div>' +
        '</div>' +
        '<div class="ripple-container">' +
        '<div class="ripple ripple-on ripple-out" style="left: 205.203px; top: 42px; background-color: rgb(33, 150, 243); transform: scale(32.875);"></div>' +
        '</div></div>'
    )
  
    clearInterval(setintervalparams.id)
    setintervalparams.id = setInterval(frame, 750)
    setintervalparams.width = 0
  
    function frame () {
      if (setintervalparams.width >= count) {
        clearInterval(id)
        setintervalparams.width = 0
      } else {
        setintervalparams.width++
  
        $('#lbluploadprogress' + filenames + '').html(
          setintervalparams.width + '%'
        )
        $('#dvuploadprogress' + filenames + '').css(
          'width',
          setintervalparams.width + '%'
        )
        $('#uploadsave').html(setintervalparams.width + '%')
      }
    }
  })
  socket.on('newsrecordset', function (data) {
    $('#uploadnotification').html(data)
  })