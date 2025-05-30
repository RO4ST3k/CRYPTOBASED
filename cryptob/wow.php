<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Notification Dropdown</title>
	<link rel="stylesheet" href="stylesheet.css">
	<script src="https://kit.fontawesome.com/b99e675b6e.js"></script>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script>
		$(document).ready(function(){
			$(".notification_icon .fa-bell").click(function(){
				$(".dropdown").toggleClass("active");
			})
		});
	</script>
</head>
<body>
	
<div class="wrapper">
	<div class="notification_wrap">
		<div class="notification_icon">
			<i class="fas fa-bell"></i>
		</div>
		<div class="dropdown">
			<div class="notify_item">
				<div class="notify_img">
					<img src="images/not_1.png" alt="profile_pic" style="width: 50px">
				</div>
				<div class="notify_info">
					<p>Alex commented on<span>Timeline Share</span></p>
					<span class="notify_time">10 minutes ago</span>
				</div>
			</div>
			<div class="notify_item">
				<div class="notify_img">
					<img src="images/not_2.png" alt="profile_pic" style="width: 50px">
				</div>
				<div class="notify_info">
					<p>Ben hur commented on your<span>Timeline Share</span></p>
					<span class="notify_time">55 minutes ago</span>
				</div>
			</div>
			<div class="notify_item">
				<div class="notify_img">
					<img src="images/not_3.png" alt="profile_pic" style="width: 50px">
				</div>
				<div class="notify_info">
					<p>Meryn trant liked your<span>Cover Picture</span></p>
					<span class="notify_time">2 hours ago</span>
				</div>
			</div>
			<div class="notify_item">
				<div class="notify_img">
					<img src="images/not_4.png" alt="profile_pic" style="width: 50px">
				</div>
				<div class="notify_info">
					<p>John wick commented on your<span>Profile Picture</span></p>
					<span class="notify_time">6 hours ago</span>
				</div>
			</div>
		</div>
	</div>
</div>

</body>
</html>